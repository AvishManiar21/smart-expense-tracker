import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { budgets, categories, expenses } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { createBudgetSchema } from '@/lib/validations/budget';
import { eq, and, gte, lte, isNull, desc, sql } from 'drizzle-orm';

/**
 * GET /api/budgets
 * List budgets with spending information
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // Format: YYYY-MM

    // Get all budgets for user
    const userBudgets = await db
      .select({
        id: budgets.id,
        categoryId: budgets.categoryId,
        amount: budgets.amount,
        period: budgets.period,
        startDate: budgets.startDate,
        endDate: budgets.endDate,
        alertThreshold: budgets.alertThreshold,
        createdAt: budgets.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          color: categories.color,
        },
      })
      .from(budgets)
      .leftJoin(categories, eq(budgets.categoryId, categories.id))
      .where(eq(budgets.userId, user.id))
      .orderBy(desc(budgets.createdAt));

    // Calculate spending for each budget
    const budgetsWithSpending = await Promise.all(
      userBudgets.map(async (budget) => {
        // Determine date range based on period
        let startDate: Date;
        let endDate: Date;

        if (month) {
          // Use specified month
          const [year, monthNum] = month.split('-');
          startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
          endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);
        } else if (budget.period === 'custom') {
          startDate = budget.startDate!;
          endDate = budget.endDate!;
        } else {
          // Current month
          const now = new Date();
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        }

        // Get total spending for this budget's category in the date range
        const [{ spent }] = await db
          .select({ spent: sql<string>`COALESCE(SUM(${expenses.amount}), 0)` })
          .from(expenses)
          .where(
            and(
              eq(expenses.userId, user.id),
              eq(expenses.categoryId, budget.categoryId),
              gte(expenses.date, startDate),
              lte(expenses.date, endDate),
              isNull(expenses.deletedAt)
            )
          );

        const spentAmount = parseFloat(spent);
        const budgetAmount = parseFloat(budget.amount);
        const percentage = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
        const remaining = budgetAmount - spentAmount;

        return {
          ...budget,
          spent: spentAmount,
          remaining,
          percentage: Math.round(percentage * 100) / 100,
          status:
            percentage >= 100
              ? 'exceeded'
              : percentage >= (budget.alertThreshold || 80)
              ? 'warning'
              : 'ok',
          periodStart: startDate,
          periodEnd: endDate,
        };
      })
    );

    return successResponse(budgetsWithSpending);
  } catch (err: any) {
    console.error('GET /api/budgets error:', err);
    return errorResponse(err.message || 'Failed to fetch budgets', 500);
  }
}

/**
 * POST /api/budgets
 * Create a new budget
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const validation = createBudgetSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('Validation error', 400, validation.error.errors);
    }

    // Check if budget already exists for this category
    const [existing] = await db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.userId, user.id),
          eq(budgets.categoryId, validation.data.categoryId)
        )
      )
      .limit(1);

    if (existing) {
      return errorResponse('Budget already exists for this category', 409);
    }

    // Prepare budget data
    const budgetData: any = {
      ...validation.data,
      userId: user.id,
    };

    if (budgetData.startDate) {
      budgetData.startDate = new Date(budgetData.startDate);
    }
    if (budgetData.endDate) {
      budgetData.endDate = new Date(budgetData.endDate);
    }

    const [budget] = await db.insert(budgets).values(budgetData).returning();

    return successResponse(budget, 'Budget created successfully', 201);
  } catch (err: any) {
    console.error('POST /api/budgets error:', err);
    return errorResponse(err.message || 'Failed to create budget', 500);
  }
}
