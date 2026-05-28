import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { income, categories } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { createIncomeSchema, incomeFiltersSchema } from '@/lib/validations/income';
import { eq, and, gte, lte, isNull, desc, asc, sql } from 'drizzle-orm';

/**
 * GET /api/income
 * List income with filters and pagination
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate filters
    const filters = incomeFiltersSchema.parse({
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
      eq(income.userId, user.id),
      isNull(income.deletedAt),
    ];

    if (filters.category) {
      conditions.push(eq(income.categoryId, filters.category));
    }

    if (filters.startDate) {
      conditions.push(gte(income.date, new Date(filters.startDate)));
    }

    if (filters.endDate) {
      conditions.push(lte(income.date, new Date(filters.endDate)));
    }

    if (filters.minAmount) {
      conditions.push(gte(income.amount, filters.minAmount.toString()));
    }

    if (filters.maxAmount) {
      conditions.push(lte(income.amount, filters.maxAmount.toString()));
    }

    // Determine sort order
    const sortColumn = filters.sortBy === 'amount' ? income.amount : income.date;
    const sortOrder = filters.sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(income)
      .where(and(...conditions));

    // Get income with category info
    const data = await db
      .select({
        id: income.id,
        amount: income.amount,
        categoryId: income.categoryId,
        description: income.description,
        date: income.date,
        isRecurring: income.isRecurring,
        recurringId: income.recurringId,
        createdAt: income.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          color: categories.color,
        },
      })
      .from(income)
      .leftJoin(categories, eq(income.categoryId, categories.id))
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
    console.error('GET /api/income error:', err);
    return errorResponse(err.message || 'Failed to fetch income', 500);
  }
}

/**
 * POST /api/income
 * Create a new income entry
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const validation = createIncomeSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation error', 400, validation.error.errors);
    }

    const [incomeEntry] = await db
      .insert(income)
      .values({
        ...validation.data,
        userId: user.id,
        date: new Date(validation.data.date),
      })
      .returning();

    return successResponse(incomeEntry, 'Income created successfully', 201);
  } catch (err: any) {
    console.error('POST /api/income error:', err);
    return errorResponse(err.message || 'Failed to create income', 500);
  }
}
