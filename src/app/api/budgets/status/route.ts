import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { budgets, expenses } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { eq, and, gte, lte, isNull, sql } from 'drizzle-orm';

/**
 * GET /api/budgets/status
 * Get budget status summary for current month
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    // Get current month date range
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Get all budgets for user
    const userBudgets = await db
      .select()
      .from(budgets)
      .where(eq(budgets.userId, user.id));

    // Calculate status for each budget
    const budgetStatuses = await Promise.all(
      userBudgets.map(async (budget) => {
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

        return {
          budgetId: budget.id,
          categoryId: budget.categoryId,
          budgetAmount,
          spentAmount,
          percentage: Math.round(percentage * 100) / 100,
          status:
            percentage >= 100
              ? 'exceeded'
              : percentage >= (budget.alertThreshold || 80)
              ? 'warning'
              : 'ok',
        };
      })
    );

    // Calculate summary statistics
    const summary = {
      total: budgetStatuses.length,
      exceeded: budgetStatuses.filter((b) => b.status === 'exceeded').length,
      warning: budgetStatuses.filter((b) => b.status === 'warning').length,
      ok: budgetStatuses.filter((b) => b.status === 'ok').length,
      totalBudgeted: budgetStatuses.reduce((sum, b) => sum + b.budgetAmount, 0),
      totalSpent: budgetStatuses.reduce((sum, b) => sum + b.spentAmount, 0),
    };

    return successResponse({
      summary,
      budgets: budgetStatuses,
      period: {
        start: startDate,
        end: endDate,
      },
    });
  } catch (err: any) {
    console.error('GET /api/budgets/status error:', err);
    return errorResponse(err.message || 'Failed to fetch budget status', 500);
  }
}
