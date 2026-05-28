import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { expenses, income } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { eq, and, gte, lte, isNull, sql } from 'drizzle-orm';

/**
 * GET /api/analytics/trends
 * Get spending and income trends over time
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get('months') || '6'); // Default 6 months
    const groupBy = searchParams.get('groupBy') || 'month'; // month, week, day

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1); // Start from first day of month
    startDate.setHours(0, 0, 0, 0);

    let dateFormat: string;
    let dateTrunc: string;

    switch (groupBy) {
      case 'day':
        dateFormat = 'YYYY-MM-DD';
        dateTrunc = 'day';
        break;
      case 'week':
        dateFormat = 'YYYY-"W"IW';
        dateTrunc = 'week';
        break;
      case 'month':
      default:
        dateFormat = 'YYYY-MM';
        dateTrunc = 'month';
        break;
    }

    // Get expenses trend
    const expensesTrend = await db
      .select({
        period: sql<string>`TO_CHAR(DATE_TRUNC('${sql.raw(dateTrunc)}', ${expenses.date}), '${sql.raw(dateFormat)}')`,
        total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, user.id),
          gte(expenses.date, startDate),
          lte(expenses.date, endDate),
          isNull(expenses.deletedAt)
        )
      )
      .groupBy(sql`DATE_TRUNC('${sql.raw(dateTrunc)}', ${expenses.date})`)
      .orderBy(sql`DATE_TRUNC('${sql.raw(dateTrunc)}', ${expenses.date})`);

    // Get income trend
    const incomeTrend = await db
      .select({
        period: sql<string>`TO_CHAR(DATE_TRUNC('${sql.raw(dateTrunc)}', ${income.date}), '${sql.raw(dateFormat)}')`,
        total: sql<string>`COALESCE(SUM(${income.amount}), 0)`,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(income)
      .where(
        and(
          eq(income.userId, user.id),
          gte(income.date, startDate),
          lte(income.date, endDate),
          isNull(income.deletedAt)
        )
      )
      .groupBy(sql`DATE_TRUNC('${sql.raw(dateTrunc)}', ${income.date})`)
      .orderBy(sql`DATE_TRUNC('${sql.raw(dateTrunc)}', ${income.date})`);

    // Combine trends
    const periodsSet = new Set([
      ...expensesTrend.map((e) => e.period),
      ...incomeTrend.map((i) => i.period),
    ]);

    const trends = Array.from(periodsSet)
      .sort()
      .map((period) => {
        const expense = expensesTrend.find((e) => e.period === period);
        const inc = incomeTrend.find((i) => i.period === period);

        const expenseTotal = expense ? parseFloat(expense.total) : 0;
        const incomeTotal = inc ? parseFloat(inc.total) : 0;

        return {
          period,
          expenses: {
            total: expenseTotal,
            count: expense?.count || 0,
          },
          income: {
            total: incomeTotal,
            count: inc?.count || 0,
          },
          netSavings: incomeTotal - expenseTotal,
        };
      });

    return successResponse({
      trends,
      period: {
        start: startDate,
        end: endDate,
        groupBy,
      },
    });
  } catch (err: any) {
    console.error('GET /api/analytics/trends error:', err);
    return errorResponse(err.message || 'Failed to fetch trends', 500);
  }
}
