import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { createCategorySchema } from '@/lib/validations/category';
import { eq, or, isNull } from 'drizzle-orm';

/**
 * GET /api/categories
 * Get all categories (system defaults + user custom)
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    // Get system categories (userId = null) and user's custom categories
    const data = await db
      .select()
      .from(categories)
      .where(or(isNull(categories.userId), eq(categories.userId, user.id)))
      .orderBy(categories.name);

    return successResponse(data);
  } catch (err: any) {
    console.error('GET /api/categories error:', err);
    return errorResponse(err.message || 'Failed to fetch categories', 500);
  }
}

/**
 * POST /api/categories
 * Create a custom category
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const validation = createCategorySchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation error', 400, validation.error.errors);
    }

    // Check if category name already exists for this user
    const [existing] = await db
      .select()
      .from(categories)
      .where(
        eq(categories.userId, user.id),
        eq(categories.name, validation.data.name)
      )
      .limit(1);

    if (existing) {
      return errorResponse('Category with this name already exists', 409);
    }

    const [category] = await db
      .insert(categories)
      .values({
        ...validation.data,
        userId: user.id,
        isDefault: false,
      })
      .returning();

    return successResponse(category, 'Category created successfully', 201);
  } catch (err: any) {
    console.error('POST /api/categories error:', err);
    return errorResponse(err.message || 'Failed to create category', 500);
  }
}
