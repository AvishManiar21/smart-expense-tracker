import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { recurringExpenses } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { updateRecurringSchema } from '@/lib/validations/recurring';
import { eq, and } from 'drizzle-orm';

/**
 * PUT /api/recurring/[id]
 * Update a recurring expense
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const validation = updateRecurringSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation error', 400, validation.error.errors);
    }

    // Check if recurring expense exists and belongs to user
    const [existing] = await db
      .select()
      .from(recurringExpenses)
      .where(
        and(
          eq(recurringExpenses.id, params.id),
          eq(recurringExpenses.userId, user.id)
        )
      )
      .limit(1);

    if (!existing) {
      return errorResponse('Recurring expense not found', 404);
    }

    // Prepare update data
    const updateData: any = { ...validation.data };

    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }
    if (updateData.nextDueDate) {
      updateData.nextDueDate = new Date(updateData.nextDueDate);
    }

    const [updated] = await db
      .update(recurringExpenses)
      .set(updateData)
      .where(eq(recurringExpenses.id, params.id))
      .returning();

    return successResponse(updated, 'Recurring expense updated successfully');
  } catch (err: any) {
    console.error('PUT /api/recurring/[id] error:', err);
    return errorResponse(err.message || 'Failed to update recurring expense', 500);
  }
}

/**
 * DELETE /api/recurring/[id]
 * Delete a recurring expense
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    // Check if recurring expense exists and belongs to user
    const [existing] = await db
      .select()
      .from(recurringExpenses)
      .where(
        and(
          eq(recurringExpenses.id, params.id),
          eq(recurringExpenses.userId, user.id)
        )
      )
      .limit(1);

    if (!existing) {
      return errorResponse('Recurring expense not found', 404);
    }

    await db
      .delete(recurringExpenses)
      .where(eq(recurringExpenses.id, params.id));

    return successResponse(null, 'Recurring expense deleted successfully');
  } catch (err: any) {
    console.error('DELETE /api/recurring/[id] error:', err);
    return errorResponse(err.message || 'Failed to delete recurring expense', 500);
  }
}
