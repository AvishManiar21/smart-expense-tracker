import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { parse } from 'csv-parse';
import { prisma } from '../server.js';

/**
 * Parse expense CSV file and return valid expenses + errors
 * Expected CSV columns: date, amount, description, category, paymentMethod
 * @param {string} filePath - Path to uploaded CSV file
 * @param {string} userId - User ID for expense ownership
 * @returns {Promise<{validExpenses: Array, errors: Array}>}
 */
export async function parseExpenseCSV(filePath, userId) {
  const validExpenses = [];
  const errors = [];

  // Get all categories for this user (system + custom)
  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { userId: null }, // System defaults
        { userId: userId }, // User's custom categories
      ],
    },
    select: {
      id: true,
      name: true,
    },
  });

  // Create category name to ID map (case-insensitive)
  const categoryMap = new Map();
  categories.forEach((cat) => {
    categoryMap.set(cat.name.toLowerCase(), cat.id);
  });

  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(
        parse({
          columns: true, // Use first row as column names
          skip_empty_lines: true,
          trim: true,
        })
      )
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', async () => {
        // Process each row
        for (let i = 0; i < results.length; i++) {
          const row = results[i];
          const rowNum = i + 2; // +2 because: 0-indexed + header row

          try {
            // Validate required fields
            if (!row.date || !row.amount || !row.description || !row.category) {
              errors.push({
                row: rowNum,
                error: 'Missing required fields (date, amount, description, category)',
                data: row,
              });
              continue;
            }

            // Parse and validate date
            const date = new Date(row.date);
            if (isNaN(date.getTime())) {
              errors.push({
                row: rowNum,
                error: 'Invalid date format. Use YYYY-MM-DD',
                data: row,
              });
              continue;
            }

            // Validate date is not too far in future
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            if (date > tomorrow) {
              errors.push({
                row: rowNum,
                error: 'Date cannot be more than 1 day in the future',
                data: row,
              });
              continue;
            }

            // Parse and validate amount
            const amount = parseFloat(row.amount);
            if (isNaN(amount) || amount <= 0) {
              errors.push({
                row: rowNum,
                error: 'Amount must be a positive number',
                data: row,
              });
              continue;
            }

            // Map category name to ID
            const categoryName = row.category.toLowerCase().trim();
            const categoryId = categoryMap.get(categoryName);
            if (!categoryId) {
              errors.push({
                row: rowNum,
                error: `Category "${row.category}" not found. Available categories: ${Array.from(categoryMap.keys()).join(', ')}`,
                data: row,
              });
              continue;
            }

            // Validate payment method (default to 'cash' if not provided)
            const paymentMethod = row.paymentMethod?.toLowerCase() || 'cash';
            if (!['cash', 'card', 'bank'].includes(paymentMethod)) {
              errors.push({
                row: rowNum,
                error: 'Payment method must be one of: cash, card, bank',
                data: row,
              });
              continue;
            }

            // Validate description length
            if (row.description.length > 500) {
              errors.push({
                row: rowNum,
                error: 'Description must not exceed 500 characters',
                data: row,
              });
              continue;
            }

            // Add valid expense
            validExpenses.push({
              userId,
              amount,
              categoryId,
              description: row.description,
              date,
              paymentMethod,
              isRecurring: false,
            });
          } catch (error) {
            errors.push({
              row: rowNum,
              error: error.message,
              data: row,
            });
          }
        }

        // Clean up uploaded file asynchronously
        fsPromises
          .unlink(filePath)
          .catch((err) => console.error('Failed to delete uploaded file:', err));

        resolve({ validExpenses, errors });
      })
      .on('error', async (error) => {
        // Clean up uploaded file on error
        try {
          await fsPromises.unlink(filePath);
        } catch (err) {
          console.error('Failed to delete uploaded file:', err);
        }
        reject(error);
      });
  });
}

/**
 * Generate CSV template for expense import
 * @returns {string} CSV template content
 */
export function generateCSVTemplate() {
  const header = 'date,amount,description,category,paymentMethod\n';
  const example1 = '2024-01-15,25.50,Lunch at restaurant,Food & Dining,card\n';
  const example2 = '2024-01-14,50.00,Gas station,Transport,cash\n';
  const example3 = '2024-01-13,120.00,Monthly gym membership,Health & Medical,bank\n';

  return header + example1 + example2 + example3;
}
