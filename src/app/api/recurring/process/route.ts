import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { recurringExpenses, expenses } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { eq, and, lte } from 'drizzle-orm';

/**
 * POST /api/recurring/process
 * Process due recurring expenses and create expense records
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all active recurring expenses that are due
    const dueRecurring = await db
      .select()
      .from(recurringExpenses)
      .where(
        and(
          eq(recurringExpenses.userId, user.id),
          eq(recurringExpenses.isActive, true),
          lte(recurringExpenses.nextDueDate, today)
        )
      );

    const processed: any[] = [];
    const errors: any[] = [];

    for (const recurring of dueRecurring) {
      try {
        // Check if end date has passed
        if (recurring.endDate && recurring.endDate < today) {
          // Deactivate recurring expense
          await db
            .update(recurringExpenses)
            .set({ isActive: false })
            .where(eq(recurringExpenses.id, recurring.id));
          continue;
        }

        // Create expense from recurring
        const [expense] = await db
          .insert(expenses)
          .values({
            userId: user.id,
            amount: recurring.amount,
            categoryId: recurring.categoryId,
            description: recurring.description,
            date: recurring.nextDueDate,
            paymentMethod: 'card',
            isRecurring: true,
            recurringId: recurring.id,
          })
          .returning();

        // Calculate next due date
        const nextDueDate = new Date(recurring.nextDueDate);

        switch (recurring.frequency) {
          case 'daily':
            nextDueDate.setDate(nextDueDate.getDate() + 1);
            break;
          case 'weekly':
            nextDueDate.setDate(nextDueDate.getDate() + 7);
            break;
          case 'monthly':
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            break;
          case 'yearly':
            nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
            break;
        }

        // Update recurring expense
        await db
          .update(recurringExpenses)
          .set({
            nextDueDate,
            lastProcessed: today,
          })
          .where(eq(recurringExpenses.id, recurring.id));

        processed.push({
          recurringId: recurring.id,
          expenseId: expense.id,
          amount: recurring.amount,
          description: recurring.description,
          nextDueDate,
        });
      } catch (err: any) {
        errors.push({
          recurringId: recurring.id,
          error: err.message,
        });
      }
    }

    return successResponse({
      processed: processed.length,
      failed: errors.length,
      details: processed,
      errors: errors.length > 0 ? errors : undefined,
    }, `Processed ${processed.length} recurring expense(s)`);
  } catch (err: any) {
    console.error('POST /api/recurring/process error:', err);
    return errorResponse(err.message || 'Failed to process recurring expenses', 500);
  }
}
