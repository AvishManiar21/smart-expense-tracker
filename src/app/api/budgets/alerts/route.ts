import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { budgets, expenses, categories } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { eq, and, gte, lte, isNull, sql } from 'drizzle-orm';

/**
 * GET /api/budgets/alerts
 * Get budget alerts (budgets that have exceeded threshold)
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    // Get current month date range
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Get all budgets with categories
    const userBudgets = await db
      .select({
        id: budgets.id,
        categoryId: budgets.categoryId,
        amount: budgets.amount,
        alertThreshold: budgets.alertThreshold,
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
          color: categories.color,
        },
      })
      .from(budgets)
      .leftJoin(categories, eq(budgets.categoryId, categories.id))
      .where(eq(budgets.userId, user.id));

    // Calculate spending and filter for alerts
    const alerts = [];

    for (const budget of userBudgets) {
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
      const threshold = budget.alertThreshold || 80;

      // Only include budgets that exceed threshold
      if (percentage >= threshold) {
        alerts.push({
          budgetId: budget.id,
          categoryId: budget.categoryId,
          categoryName: budget.category?.name || 'Unknown',
          categoryIcon: budget.category?.icon,
          categoryColor: budget.category?.color,
          budgetAmount,
          spentAmount,
          percentage: Math.round(percentage * 100) / 100,
          remaining: budgetAmount - spentAmount,
          threshold,
          severity: percentage >= 100 ? 'critical' : percentage >= 90 ? 'high' : 'medium',
          message:
            percentage >= 100
              ? `Budget exceeded by ${((percentage - 100).toFixed(1))}%`
              : `${(100 - percentage).toFixed(1)}% remaining`,
        });
      }
    }

    // Sort by severity (critical first, then by percentage descending)
    alerts.sort((a, b) => {
      if (a.severity === 'critical' && b.severity !== 'critical') return -1;
      if (a.severity !== 'critical' && b.severity === 'critical') return 1;
      return b.percentage - a.percentage;
    });

    return successResponse({
      alerts,
      count: alerts.length,
      period: {
        start: startDate,
        end: endDate,
      },
    });
  } catch (err: any) {
    console.error('GET /api/budgets/alerts error:', err);
    return errorResponse(err.message || 'Failed to fetch budget alerts', 500);
  }
}
