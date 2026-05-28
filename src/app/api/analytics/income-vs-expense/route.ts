import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { expenses, income } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { eq, and, gte, lte, isNull, sql } from 'drizzle-orm';

/**
 * GET /api/analytics/income-vs-expense
 * Get income vs expense comparison over time
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get('months') || '12'); // Default 12 months

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // Get monthly expenses
    const monthlyExpenses = await db
      .select({
        month: sql<string>`TO_CHAR(DATE_TRUNC('month', ${expenses.date}), 'YYYY-MM')`,
        total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
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
      .groupBy(sql`DATE_TRUNC('month', ${expenses.date})`)
      .orderBy(sql`DATE_TRUNC('month', ${expenses.date})`);

    // Get monthly income
    const monthlyIncome = await db
      .select({
        month: sql<string>`TO_CHAR(DATE_TRUNC('month', ${income.date}), 'YYYY-MM')`,
        total: sql<string>`COALESCE(SUM(${income.amount}), 0)`,
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
      .groupBy(sql`DATE_TRUNC('month', ${income.date})`)
      .orderBy(sql`DATE_TRUNC('month', ${income.date})`);

    // Combine data
    const monthsSet = new Set([
      ...monthlyExpenses.map((e) => e.month),
      ...monthlyIncome.map((i) => i.month),
    ]);

    const comparison = Array.from(monthsSet)
      .sort()
      .map((month) => {
        const expense = monthlyExpenses.find((e) => e.month === month);
        const inc = monthlyIncome.find((i) => i.month === month);

        const expenseTotal = expense ? parseFloat(expense.total) : 0;
        const incomeTotal = inc ? parseFloat(inc.total) : 0;
        const netSavings = incomeTotal - expenseTotal;
        const savingsRate = incomeTotal > 0 ? (netSavings / incomeTotal) * 100 : 0;

        return {
          month,
          expenses: expenseTotal,
          income: incomeTotal,
          netSavings,
          savingsRate: Math.round(savingsRate * 100) / 100,
        };
      });

    // Calculate summary statistics
    const totalExpenses = comparison.reduce((sum, m) => sum + m.expenses, 0);
    const totalIncome = comparison.reduce((sum, m) => sum + m.income, 0);
    const avgMonthlyExpenses = totalExpenses / comparison.length;
    const avgMonthlyIncome = totalIncome / comparison.length;
    const avgSavingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return successResponse({
      comparison,
      summary: {
        totalExpenses,
        totalIncome,
        totalNetSavings: totalIncome - totalExpenses,
        avgMonthlyExpenses: Math.round(avgMonthlyExpenses * 100) / 100,
        avgMonthlyIncome: Math.round(avgMonthlyIncome * 100) / 100,
        avgSavingsRate: Math.round(avgSavingsRate * 100) / 100,
      },
      period: {
        start: startDate,
        end: endDate,
        months: comparison.length,
      },
    });
  } catch (err: any) {
    console.error('GET /api/analytics/income-vs-expense error:', err);
    return errorResponse(err.message || 'Failed to fetch income vs expense data', 500);
  }
}
