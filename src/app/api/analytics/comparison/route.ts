import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { expenses, income } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { eq, and, gte, lte, isNull, sql } from 'drizzle-orm';

/**
 * GET /api/analytics/comparison
 * Compare financial data between two time periods
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const period1 = searchParams.get('period1'); // Format: YYYY-MM
    const period2 = searchParams.get('period2'); // Format: YYYY-MM

    // Default to current month vs last month if not provided
    const now = new Date();

    let period1Start: Date, period1End: Date;
    let period2Start: Date, period2End: Date;

    if (period1) {
      const [year1, month1] = period1.split('-');
      period1Start = new Date(parseInt(year1), parseInt(month1) - 1, 1);
      period1End = new Date(parseInt(year1), parseInt(month1), 0, 23, 59, 59, 999);
    } else {
      // Current month
      period1Start = new Date(now.getFullYear(), now.getMonth(), 1);
      period1End = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    if (period2) {
      const [year2, month2] = period2.split('-');
      period2Start = new Date(parseInt(year2), parseInt(month2) - 1, 1);
      period2End = new Date(parseInt(year2), parseInt(month2), 0, 23, 59, 59, 999);
    } else {
      // Last month
      period2Start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      period2End = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    }

    // Helper function to get period stats
    const getPeriodStats = async (startDate: Date, endDate: Date) => {
      const [{ totalExpenses, expenseCount }] = await db
        .select({
          totalExpenses: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
          expenseCount: sql<number>`COUNT(*)::int`,
        })
        .from(expenses)
        .where(
          and(
            eq(expenses.userId, user.id),
            gte(expenses.date, startDate),
            lte(expenses.date, endDate),
            isNull(expenses.deletedAt)
          )
        );

      const [{ totalIncome, incomeCount }] = await db
        .select({
          totalIncome: sql<string>`COALESCE(SUM(${income.amount}), 0)`,
          incomeCount: sql<number>`COUNT(*)::int`,
        })
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

      return {
        expenses: {
          total: expensesTotal,
          count: expenseCount,
          average: expenseCount > 0 ? expensesTotal / expenseCount : 0,
        },
        income: {
          total: incomeTotal,
          count: incomeCount,
          average: incomeCount > 0 ? incomeTotal / incomeCount : 0,
        },
        netSavings: incomeTotal - expensesTotal,
        savingsRate: incomeTotal > 0 ? ((incomeTotal - expensesTotal) / incomeTotal) * 100 : 0,
      };
    };

    const period1Stats = await getPeriodStats(period1Start, period1End);
    const period2Stats = await getPeriodStats(period2Start, period2End);

    // Calculate changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const changes = {
      expenses: {
        total: calculateChange(period1Stats.expenses.total, period2Stats.expenses.total),
        count: calculateChange(period1Stats.expenses.count, period2Stats.expenses.count),
        average: calculateChange(period1Stats.expenses.average, period2Stats.expenses.average),
      },
      income: {
        total: calculateChange(period1Stats.income.total, period2Stats.income.total),
        count: calculateChange(period1Stats.income.count, period2Stats.income.count),
        average: calculateChange(period1Stats.income.average, period2Stats.income.average),
      },
      netSavings: calculateChange(period1Stats.netSavings, period2Stats.netSavings),
      savingsRate: period1Stats.savingsRate - period2Stats.savingsRate,
    };

    return successResponse({
      period1: {
        start: period1Start,
        end: period1End,
        stats: period1Stats,
      },
      period2: {
        start: period2Start,
        end: period2End,
        stats: period2Stats,
      },
      changes: {
        expenses: {
          total: Math.round(changes.expenses.total * 100) / 100,
          count: Math.round(changes.expenses.count * 100) / 100,
          average: Math.round(changes.expenses.average * 100) / 100,
        },
        income: {
          total: Math.round(changes.income.total * 100) / 100,
          count: Math.round(changes.income.count * 100) / 100,
          average: Math.round(changes.income.average * 100) / 100,
        },
        netSavings: Math.round(changes.netSavings * 100) / 100,
        savingsRate: Math.round(changes.savingsRate * 100) / 100,
      },
    });
  } catch (err: any) {
    console.error('GET /api/analytics/comparison error:', err);
    return errorResponse(err.message || 'Failed to fetch comparison', 500);
  }
}
