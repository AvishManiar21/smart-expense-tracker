import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { expenses, income } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { eq, and, gte, lte, isNull, sql } from 'drizzle-orm';

/**
 * GET /api/analytics/summary
 * Get financial summary for a time period
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // Format: YYYY-MM
    const year = searchParams.get('year'); // Format: YYYY

    let startDate: Date;
    let endDate: Date;

    if (month) {
      // Specific month
      const [yearNum, monthNum] = month.split('-');
      startDate = new Date(parseInt(yearNum), parseInt(monthNum) - 1, 1);
      endDate = new Date(parseInt(yearNum), parseInt(monthNum), 0, 23, 59, 59, 999);
    } else if (year) {
      // Entire year
      const yearNum = parseInt(year);
      startDate = new Date(yearNum, 0, 1);
      endDate = new Date(yearNum, 11, 31, 23, 59, 59, 999);
    } else {
      // Current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    // Get total expenses
    const [{ totalExpenses }] = await db
      .select({ totalExpenses: sql<string>`COALESCE(SUM(${expenses.amount}), 0)` })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, user.id),
          gte(expenses.date, startDate),
          lte(expenses.date, endDate),
          isNull(expenses.deletedAt)
        )
      );

    // Get total income
    const [{ totalIncome }] = await db
      .select({ totalIncome: sql<string>`COALESCE(SUM(${income.amount}), 0)` })
      .from(income)
      .where(
        and(
          eq(income.userId, user.id),
          gte(income.date, startDate),
          lte(income.date, endDate),
          isNull(income.deletedAt)
        )
      );

    // Get expense count
    const [{ expenseCount }] = await db
      .select({ expenseCount: sql<number>`COUNT(*)::int` })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, user.id),
          gte(expenses.date, startDate),
          lte(expenses.date, endDate),
          isNull(expenses.deletedAt)
        )
      );

    // Get income count
    const [{ incomeCount }] = await db
      .select({ incomeCount: sql<number>`COUNT(*)::int` })
      .from(income)
      .where(
        and(
          eq(income.userId, user.id),
          gte(income.date, startDate),
          lte(income.date, endDate),
          isNull(income.deletedAt)
        )
      );

    const expensesTotal = parseFloat(totalExpenses);
    const incomeTotal = parseFloat(totalIncome);
    const netSavings = incomeTotal - expensesTotal;
    const savingsRate = incomeTotal > 0 ? (netSavings / incomeTotal) * 100 : 0;

    return successResponse({
      period: {
        start: startDate,
        end: endDate,
      },
      expenses: {
        total: expensesTotal,
        count: expenseCount,
      },
      income: {
        total: incomeTotal,
        count: incomeCount,
      },
      netSavings,
      savingsRate: Math.round(savingsRate * 100) / 100,
    });
  } catch (err: any) {
    console.error('GET /api/analytics/summary error:', err);
    return errorResponse(err.message || 'Failed to fetch analytics summary', 500);
  }
}
