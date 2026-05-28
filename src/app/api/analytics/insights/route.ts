import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { expenses, income, budgets, categories } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { eq, and, gte, lte, isNull, sql, desc } from 'drizzle-orm';

/**
 * GET /api/analytics/insights
 * Generate AI-powered financial insights
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const insights: any[] = [];

    // Current month dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Previous month dates
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Insight 1: Weekend vs Weekday Spending
    const weekendExpenses = await db
      .select({ total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)` })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, user.id),
          gte(expenses.date, currentMonthStart),
          lte(expenses.date, currentMonthEnd),
          isNull(expenses.deletedAt),
          sql`EXTRACT(DOW FROM ${expenses.date}) IN (0, 6)` // Sunday=0, Saturday=6
        )
      );

    const weekdayExpenses = await db
      .select({ total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)` })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, user.id),
          gte(expenses.date, currentMonthStart),
          lte(expenses.date, currentMonthEnd),
          isNull(expenses.deletedAt),
          sql`EXTRACT(DOW FROM ${expenses.date}) BETWEEN 1 AND 5`
        )
      );

    const weekendTotal = parseFloat(weekendExpenses[0]?.total || '0');
    const weekdayTotal = parseFloat(weekdayExpenses[0]?.total || '0');

    if (weekendTotal > weekdayTotal * 1.2) {
      insights.push({
        type: 'spending_pattern',
        severity: 'info',
        title: 'Higher Weekend Spending',
        message: `You spend ${Math.round(((weekendTotal - weekdayTotal) / weekdayTotal) * 100)}% more on weekends than weekdays.`,
        actionable: true,
        suggestion: 'Consider setting weekend-specific budgets or planning activities in advance.',
      });
    }

    // Insight 2: Month-over-Month Category Changes
    const currentMonthByCategory = await db
      .select({
        categoryId: expenses.categoryId,
        categoryName: categories.name,
        total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(
        and(
          eq(expenses.userId, user.id),
          gte(expenses.date, currentMonthStart),
          lte(expenses.date, currentMonthEnd),
          isNull(expenses.deletedAt)
        )
      )
      .groupBy(expenses.categoryId, categories.name);

    const lastMonthByCategory = await db
      .select({
        categoryId: expenses.categoryId,
        total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, user.id),
          gte(expenses.date, lastMonthStart),
          lte(expenses.date, lastMonthEnd),
          isNull(expenses.deletedAt)
        )
      )
      .groupBy(expenses.categoryId);

    for (const current of currentMonthByCategory) {
      const previous = lastMonthByCategory.find((p) => p.categoryId === current.categoryId);
      if (previous) {
        const currentTotal = parseFloat(current.total);
        const previousTotal = parseFloat(previous.total);
        const change = ((currentTotal - previousTotal) / previousTotal) * 100;

        if (Math.abs(change) > 50) {
          insights.push({
            type: 'category_change',
            severity: change > 0 ? 'warning' : 'success',
            title: `${change > 0 ? 'Increased' : 'Decreased'} ${current.categoryName} Spending`,
            message: `Your ${current.categoryName} expenses ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(Math.round(change))}% compared to last month.`,
            actionable: change > 0,
            suggestion:
              change > 0
                ? `Review your ${current.categoryName} expenses to identify unexpected costs.`
                : undefined,
          });
        }
      }
    }

    // Insight 3: Budget Performance
    const userBudgets = await db
      .select({
        categoryId: budgets.categoryId,
        amount: budgets.amount,
        categoryName: categories.name,
      })
      .from(budgets)
      .leftJoin(categories, eq(budgets.categoryId, categories.id))
      .where(eq(budgets.userId, user.id));

    for (const budget of userBudgets) {
      const [{ spent }] = await db
        .select({ spent: sql<string>`COALESCE(SUM(${expenses.amount}), 0)` })
        .from(expenses)
        .where(
          and(
            eq(expenses.userId, user.id),
            eq(expenses.categoryId, budget.categoryId),
            gte(expenses.date, currentMonthStart),
            lte(expenses.date, currentMonthEnd),
            isNull(expenses.deletedAt)
          )
        );

      const spentAmount = parseFloat(spent);
      const budgetAmount = parseFloat(budget.amount);
      const percentage = (spentAmount / budgetAmount) * 100;

      if (percentage >= 90) {
        insights.push({
          type: 'budget_alert',
          severity: percentage >= 100 ? 'critical' : 'warning',
          title: `${budget.categoryName} Budget ${percentage >= 100 ? 'Exceeded' : 'Almost Reached'}`,
          message: `You've used ${Math.round(percentage)}% of your ${budget.categoryName} budget.`,
          actionable: true,
          suggestion: 'Consider reducing expenses in this category for the rest of the month.',
        });
      }
    }

    // Insight 4: Savings Rate
    const [{ totalExpenses }] = await db
      .select({ totalExpenses: sql<string>`COALESCE(SUM(${expenses.amount}), 0)` })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, user.id),
          gte(expenses.date, currentMonthStart),
          lte(expenses.date, currentMonthEnd),
          isNull(expenses.deletedAt)
        )
      );

    const [{ totalIncome }] = await db
      .select({ totalIncome: sql<string>`COALESCE(SUM(${income.amount}), 0)` })
      .from(income)
      .where(
        and(
          eq(income.userId, user.id),
          gte(income.date, currentMonthStart),
          lte(income.date, currentMonthEnd),
          isNull(income.deletedAt)
        )
      );

    const expensesTotal = parseFloat(totalExpenses);
    const incomeTotal = parseFloat(totalIncome);
    const savingsRate = incomeTotal > 0 ? ((incomeTotal - expensesTotal) / incomeTotal) * 100 : 0;

    if (savingsRate < 10 && incomeTotal > 0) {
      insights.push({
        type: 'savings_rate',
        severity: 'warning',
        title: 'Low Savings Rate',
        message: `Your savings rate is ${Math.round(savingsRate)}%. Financial experts recommend saving at least 20% of income.`,
        actionable: true,
        suggestion: 'Review your expenses and identify areas where you can cut back.',
      });
    } else if (savingsRate >= 20) {
      insights.push({
        type: 'savings_rate',
        severity: 'success',
        title: 'Great Savings Rate!',
        message: `You're saving ${Math.round(savingsRate)}% of your income. Keep up the good work!`,
        actionable: false,
      });
    }

    // Insight 5: Unusual Expenses (Outliers)
    const avgExpense = await db
      .select({
        avg: sql<string>`AVG(${expenses.amount})`,
        stddev: sql<string>`STDDEV(${expenses.amount})`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, user.id),
          gte(expenses.date, currentMonthStart),
          lte(expenses.date, currentMonthEnd),
          isNull(expenses.deletedAt)
        )
      );

    const avg = parseFloat(avgExpense[0]?.avg || '0');
    const stddev = parseFloat(avgExpense[0]?.stddev || '0');

    if (avg > 0 && stddev > 0) {
      const outliers = await db
        .select({
          amount: expenses.amount,
          description: expenses.description,
          categoryName: categories.name,
        })
        .from(expenses)
        .leftJoin(categories, eq(expenses.categoryId, categories.id))
        .where(
          and(
            eq(expenses.userId, user.id),
            gte(expenses.date, currentMonthStart),
            lte(expenses.date, currentMonthEnd),
            isNull(expenses.deletedAt),
            sql`${expenses.amount}::numeric > ${avg + 2 * stddev}`
          )
        )
        .orderBy(desc(expenses.amount))
        .limit(3);

      if (outliers.length > 0) {
        insights.push({
          type: 'unusual_expense',
          severity: 'info',
          title: 'Unusual Expenses Detected',
          message: `You have ${outliers.length} expense(s) significantly higher than your average.`,
          actionable: true,
          details: outliers.map((o) => ({
            amount: parseFloat(o.amount),
            description: o.description,
            category: o.categoryName,
          })),
          suggestion: 'Review these large expenses to ensure they were planned.',
        });
      }
    }

    return successResponse({
      insights: insights.sort((a, b) => {
        const severityOrder: any = { critical: 0, warning: 1, info: 2, success: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      }),
      generatedAt: new Date(),
      period: {
        start: currentMonthStart,
        end: currentMonthEnd,
      },
    });
  } catch (err: any) {
    console.error('GET /api/analytics/insights error:', err);
    return errorResponse(err.message || 'Failed to generate insights', 500);
  }
}
