import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { updateCategorySchema } from '@/lib/validations/category';
import { eq, and } from 'drizzle-orm';

/**
 * PUT /api/categories/[id]
 * Update a custom category
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const validation = updateCategorySchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation error', 400, validation.error.errors);
    }

    // Check if category exists and belongs to user (can't edit system categories)
    const [existing] = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.id, params.id),
          eq(categories.userId, user.id)
        )
      )
      .limit(1);

    if (!existing) {
      return errorResponse('Category not found or cannot be edited', 404);
    }

    const [updated] = await db
      .update(categories)
      .set(validation.data)
      .where(eq(categories.id, params.id))
      .returning();

    return successResponse(updated, 'Category updated successfully');
  } catch (err: any) {
    console.error('PUT /api/categories/[id] error:', err);
    return errorResponse(err.message || 'Failed to update category', 500);
  }
}

/**
 * DELETE /api/categories/[id]
 * Delete a custom category
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    // Check if category exists and belongs to user (can't delete system categories)
    const [existing] = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.id, params.id),
          eq(categories.userId, user.id)
        )
      )
      .limit(1);

    if (!existing) {
      return errorResponse('Category not found or cannot be deleted', 404);
    }

    // TODO: Check if category is in use by expenses/budgets
    // For now, just delete

    await db
      .delete(categories)
      .where(eq(categories.id, params.id));

    return successResponse(null, 'Category deleted successfully');
  } catch (err: any) {
    console.error('DELETE /api/categories/[id] error:', err);
    return errorResponse(err.message || 'Failed to delete category', 500);
  }
}
