import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { expenses, categories } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { eq, or, isNull } from 'drizzle-orm';

/**
 * POST /api/expenses/bulk
 * Bulk import expenses from CSV
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { expenses: csvExpenses } = body;

    if (!Array.isArray(csvExpenses) || csvExpenses.length === 0) {
      return errorResponse('Invalid or empty expenses array', 400);
    }

    // Get all categories (system + user custom)
    const allCategories = await db
      .select()
      .from(categories)
      .where(or(isNull(categories.userId), eq(categories.userId, user.id)));

    const categoryMap = new Map(allCategories.map((cat) => [cat.name.toLowerCase(), cat.id]));

    const imported: any[] = [];
    const failed: any[] = [];

    for (const [index, expense] of csvExpenses.entries()) {
      try {
        // Validate required fields
        if (!expense.amount || !expense.description || !expense.date) {
          failed.push({
            row: index + 1,
            data: expense,
            error: 'Missing required fields (amount, description, date)',
          });
          continue;
        }

        // Parse amount
        const amount = parseFloat(expense.amount.toString().replace(/[^0-9.-]/g, ''));
        if (isNaN(amount) || amount <= 0) {
          failed.push({
            row: index + 1,
            data: expense,
            error: 'Invalid amount',
          });
          continue;
        }

        // Parse date
        let expenseDate: Date;
        try {
          expenseDate = new Date(expense.date);
          if (isNaN(expenseDate.getTime())) {
            throw new Error('Invalid date');
          }
        } catch {
          failed.push({
            row: index + 1,
            data: expense,
            error: 'Invalid date format',
          });
          continue;
        }

        // Find or create category
        let categoryId: string;
        const categoryName = (expense.category || 'Other').trim();
        const categoryKey = categoryName.toLowerCase();

        if (categoryMap.has(categoryKey)) {
          categoryId = categoryMap.get(categoryKey)!;
        } else {
          // Create new category
          const [newCategory] = await db
            .insert(categories)
            .values({
              name: categoryName,
              icon: '📦',
              color: '#6b7280',
              userId: user.id,
              isDefault: false,
            })
            .returning();
          categoryId = newCategory.id;
          categoryMap.set(categoryKey, categoryId);
        }

        // Insert expense
        const [newExpense] = await db
          .insert(expenses)
          .values({
            userId: user.id,
            amount: amount.toFixed(2),
            categoryId,
            description: expense.description,
            date: expenseDate,
            paymentMethod: expense.paymentMethod || 'card',
            isRecurring: false,
          })
          .returning();

        imported.push({
          row: index + 1,
          id: newExpense.id,
          amount,
          description: expense.description,
          category: categoryName,
          date: expenseDate,
        });
      } catch (err: any) {
        failed.push({
          row: index + 1,
          data: expense,
          error: err.message || 'Unknown error',
        });
      }
    }

    return successResponse(
      {
        imported: imported.length,
        failed: failed.length,
        total: csvExpenses.length,
        details: {
          imported,
          failed,
        },
      },
      `Successfully imported ${imported.length} expense(s)`,
      imported.length > 0 ? 201 : 400
    );
  } catch (err: any) {
    console.error('POST /api/expenses/bulk error:', err);
    return errorResponse(err.message || 'Failed to import expenses', 500);
  }
}
