import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { expenses } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { updateExpenseSchema } from '@/lib/validations/expense';
import { eq, and, isNull } from 'drizzle-orm';

/**
 * GET /api/expenses/[id]
 * Get a single expense
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const [expense] = await db
      .select()
      .from(expenses)
      .where(
        and(
          eq(expenses.id, params.id),
          eq(expenses.userId, user.id),
          isNull(expenses.deletedAt)
        )
      )
      .limit(1);

    if (!expense) {
      return errorResponse('Expense not found', 404);
    }

    return successResponse(expense);
  } catch (err: any) {
    console.error('GET /api/expenses/[id] error:', err);
    return errorResponse(err.message || 'Failed to fetch expense', 500);
  }
}

/**
 * PUT /api/expenses/[id]
 * Update an expense
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const validation = updateExpenseSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation error', 400, validation.error.errors);
    }

    // Check if expense exists and belongs to user
    const [existing] = await db
      .select()
      .from(expenses)
      .where(
        and(
          eq(expenses.id, params.id),
          eq(expenses.userId, user.id),
          isNull(expenses.deletedAt)
        )
      )
      .limit(1);

    if (!existing) {
      return errorResponse('Expense not found', 404);
    }

    // Prepare update data
    const updateData: any = { ...validation.data };
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const [updated] = await db
      .update(expenses)
      .set(updateData)
      .where(eq(expenses.id, params.id))
      .returning();

    return successResponse(updated, 'Expense updated successfully');
  } catch (err: any) {
    console.error('PUT /api/expenses/[id] error:', err);
    return errorResponse(err.message || 'Failed to update expense', 500);
  }
}

/**
 * DELETE /api/expenses/[id]
 * Soft delete an expense
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    // Check if expense exists and belongs to user
    const [existing] = await db
      .select()
      .from(expenses)
      .where(
        and(
          eq(expenses.id, params.id),
          eq(expenses.userId, user.id),
          isNull(expenses.deletedAt)
        )
      )
      .limit(1);

    if (!existing) {
      return errorResponse('Expense not found', 404);
    }

    // Soft delete
    await db
      .update(expenses)
      .set({ deletedAt: new Date() })
      .where(eq(expenses.id, params.id));

    return successResponse(null, 'Expense deleted successfully');
  } catch (err: any) {
    console.error('DELETE /api/expenses/[id] error:', err);
    return errorResponse(err.message || 'Failed to delete expense', 500);
  }
}
