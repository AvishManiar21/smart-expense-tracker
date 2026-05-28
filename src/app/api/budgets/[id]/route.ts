import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { budgets } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { updateBudgetSchema } from '@/lib/validations/budget';
import { eq, and } from 'drizzle-orm';

/**
 * PUT /api/budgets/[id]
 * Update a budget
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const validation = updateBudgetSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation error', 400, validation.error.errors);
    }

    // Check if budget exists and belongs to user
    const [existing] = await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.id, params.id), eq(budgets.userId, user.id)))
      .limit(1);

    if (!existing) {
      return errorResponse('Budget not found', 404);
    }

    // Prepare update data
    const updateData: any = { ...validation.data };
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    const [updated] = await db
      .update(budgets)
      .set(updateData)
      .where(eq(budgets.id, params.id))
      .returning();

    return successResponse(updated, 'Budget updated successfully');
  } catch (err: any) {
    console.error('PUT /api/budgets/[id] error:', err);
    return errorResponse(err.message || 'Failed to update budget', 500);
  }
}

/**
 * DELETE /api/budgets/[id]
 * Delete a budget
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    // Check if budget exists and belongs to user
    const [existing] = await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.id, params.id), eq(budgets.userId, user.id)))
      .limit(1);

    if (!existing) {
      return errorResponse('Budget not found', 404);
    }

    await db.delete(budgets).where(eq(budgets.id, params.id));

    return successResponse(null, 'Budget deleted successfully');
  } catch (err: any) {
    console.error('DELETE /api/budgets/[id] error:', err);
    return errorResponse(err.message || 'Failed to delete budget', 500);
  }
}
