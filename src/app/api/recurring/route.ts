import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { recurringExpenses, categories } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { createRecurringSchema } from '@/lib/validations/recurring';
import { eq, desc } from 'drizzle-orm';

/**
 * GET /api/recurring
 * List all recurring expenses
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    // Build where conditions
    let conditions: any[] = [eq(recurringExpenses.userId, user.id)];

    if (isActive !== null && isActive !== undefined) {
      conditions.push(eq(recurringExpenses.isActive, isActive === 'true'));
    }

    // Get recurring expenses with category info
    const data = await db
      .select({
        id: recurringExpenses.id,
        amount: recurringExpenses.amount,
        categoryId: recurringExpenses.categoryId,
        description: recurringExpenses.description,
        frequency: recurringExpenses.frequency,
        startDate: recurringExpenses.startDate,
        endDate: recurringExpenses.endDate,
        nextDueDate: recurringExpenses.nextDueDate,
        isActive: recurringExpenses.isActive,
        lastProcessed: recurringExpenses.lastProcessed,
        createdAt: recurringExpenses.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          color: categories.color,
        },
      })
      .from(recurringExpenses)
      .leftJoin(categories, eq(recurringExpenses.categoryId, categories.id))
      .where(conditions.length > 1 ? conditions[0] : eq(recurringExpenses.userId, user.id))
      .orderBy(desc(recurringExpenses.nextDueDate));

    return successResponse(data);
  } catch (err: any) {
    console.error('GET /api/recurring error:', err);
    return errorResponse(err.message || 'Failed to fetch recurring expenses', 500);
  }
}

/**
 * POST /api/recurring
 * Create a new recurring expense
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const validation = createRecurringSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation error', 400, validation.error.errors);
    }

    // Calculate next due date based on frequency and start date
    const startDate = new Date(validation.data.startDate);
    const nextDueDate = new Date(startDate);

    // Set next due date based on frequency
    switch (validation.data.frequency) {
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

    const recurringData: any = {
      ...validation.data,
      userId: user.id,
      startDate,
      endDate: validation.data.endDate ? new Date(validation.data.endDate) : null,
      nextDueDate,
      isActive: true,
      lastProcessed: null,
    };

    const [recurring] = await db
      .insert(recurringExpenses)
      .values(recurringData)
      .returning();

    return successResponse(recurring, 'Recurring expense created successfully', 201);
  } catch (err: any) {
    console.error('POST /api/recurring error:', err);
    return errorResponse(err.message || 'Failed to create recurring expense', 500);
  }
}
