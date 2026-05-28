import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { income } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { updateIncomeSchema } from '@/lib/validations/income';
import { eq, and, isNull } from 'drizzle-orm';

/**
 * GET /api/income/[id]
 * Get a single income entry
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const [incomeEntry] = await db
      .select()
      .from(income)
      .where(
        and(
          eq(income.id, params.id),
          eq(income.userId, user.id),
          isNull(income.deletedAt)
        )
      )
      .limit(1);

    if (!incomeEntry) {
      return errorResponse('Income not found', 404);
    }

    return successResponse(incomeEntry);
  } catch (err: any) {
    console.error('GET /api/income/[id] error:', err);
    return errorResponse(err.message || 'Failed to fetch income', 500);
  }
}

/**
 * PUT /api/income/[id]
 * Update an income entry
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const validation = updateIncomeSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation error', 400, validation.error.errors);
    }

    // Check if income exists and belongs to user
    const [existing] = await db
      .select()
      .from(income)
      .where(
        and(
          eq(income.id, params.id),
          eq(income.userId, user.id),
          isNull(income.deletedAt)
        )
      )
      .limit(1);

    if (!existing) {
      return errorResponse('Income not found', 404);
    }

    // Prepare update data
    const updateData: any = { ...validation.data };
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const [updated] = await db
      .update(income)
      .set(updateData)
      .where(eq(income.id, params.id))
      .returning();

    return successResponse(updated, 'Income updated successfully');
  } catch (err: any) {
    console.error('PUT /api/income/[id] error:', err);
    return errorResponse(err.message || 'Failed to update income', 500);
  }
}

/**
 * DELETE /api/income/[id]
 * Soft delete an income entry
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    // Check if income exists and belongs to user
    const [existing] = await db
      .select()
      .from(income)
      .where(
        and(
          eq(income.id, params.id),
          eq(income.userId, user.id),
          isNull(income.deletedAt)
        )
      )
      .limit(1);

    if (!existing) {
      return errorResponse('Income not found', 404);
    }

    // Soft delete
    await db
      .update(income)
      .set({ deletedAt: new Date() })
      .where(eq(income.id, params.id));

    return successResponse(null, 'Income deleted successfully');
  } catch (err: any) {
    console.error('DELETE /api/income/[id] error:', err);
    return errorResponse(err.message || 'Failed to delete income', 500);
  }
}
