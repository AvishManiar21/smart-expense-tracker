import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { expenses, categories } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { createExpenseSchema, expenseFiltersSchema } from '@/lib/validations/expense';
import { eq, and, gte, lte, isNull, desc, asc, between, sql } from 'drizzle-orm';

/**
 * GET /api/expenses
 * List expenses with filters and pagination
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate filters
    const filters = expenseFiltersSchema.parse({
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 20,
      sortBy: searchParams.get('sortBy') || 'date',
      sortOrder: searchParams.get('sortOrder') || 'desc',
      category: searchParams.get('category') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      minAmount: searchParams.get('minAmount') ? Number(searchParams.get('minAmount')) : undefined,
      maxAmount: searchParams.get('maxAmount') ? Number(searchParams.get('maxAmount')) : undefined,
    });

    // Build where conditions
    const conditions = [
      eq(expenses.userId, user.id),
      isNull(expenses.deletedAt),
    ];

    if (filters.category) {
      conditions.push(eq(expenses.categoryId, filters.category));
    }

    if (filters.startDate) {
      conditions.push(gte(expenses.date, new Date(filters.startDate)));
    }

    if (filters.endDate) {
      conditions.push(lte(expenses.date, new Date(filters.endDate)));
    }

    if (filters.minAmount) {
      conditions.push(gte(expenses.amount, filters.minAmount.toString()));
    }

    if (filters.maxAmount) {
      conditions.push(lte(expenses.amount, filters.maxAmount.toString()));
    }

    // Determine sort order
    const sortColumn = filters.sortBy === 'amount' ? expenses.amount : expenses.date;
    const sortOrder = filters.sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(expenses)
      .where(and(...conditions));

    // Get expenses with category info
    const data = await db
      .select({
        id: expenses.id,
        amount: expenses.amount,
        categoryId: expenses.categoryId,
        description: expenses.description,
        date: expenses.date,
        paymentMethod: expenses.paymentMethod,
        receiptUrl: expenses.receiptUrl,
        isRecurring: expenses.isRecurring,
        recurringId: expenses.recurringId,
        createdAt: expenses.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          color: categories.color,
        },
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(sortOrder)
      .limit(filters.limit)
      .offset((filters.page - 1) * filters.limit);

    return successResponse({
      data,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: count,
        totalPages: Math.ceil(count / filters.limit),
      },
    });
  } catch (err: any) {
    console.error('GET /api/expenses error:', err);
    return errorResponse(err.message || 'Failed to fetch expenses', 500);
  }
}

/**
 * POST /api/expenses
 * Create a new expense
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const validation = createExpenseSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation error', 400, validation.error.errors);
    }

    const [expense] = await db
      .insert(expenses)
      .values({
        ...validation.data,
        userId: user.id,
        date: new Date(validation.data.date),
      })
      .returning();

    return successResponse(expense, 'Expense created successfully', 201);
  } catch (err: any) {
    console.error('POST /api/expenses error:', err);
    return errorResponse(err.message || 'Failed to create expense', 500);
  }
}
