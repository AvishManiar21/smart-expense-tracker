import { db } from '@/lib/db';
import { expenses, income, budgets, categories, recurringExpenses } from '@/lib/db/schema';
import { eq, and, gte, lte, isNull, sql, desc } from 'drizzle-orm';

// ============================================================================
// TYPES
// ============================================================================

export interface Insight {
  type: 'pattern' | 'alert' | 'achievement' | 'suggestion' | 'projection';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'success' | 'danger';
  icon: string;
  amount?: string;
  percentage?: number;
  actionable?: boolean;
  suggestion?: string;
  details?: any;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  total: number;
  count: number;
  percentage: number;
  color?: string;
  icon?: string;
}

export interface TrendDataPoint {
  period: string;
  expenses: number;
  income: number;
  netSavings: number;
}

export interface MonthRange {
  start: Date;
  end: Date;
}

// ============================================================================
// DATE UTILITIES
// ============================================================================

/**
 * Get the start and end dates for a specific month
 * @param year - Year (e.g., 2024)
 * @param month - Month (1-12)
 * @returns Object with start and end dates
 */
export function getMonthRange(year: number, month: number): MonthRange {
  const start = new Date(year, month - 1, 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(year, month, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

/**
 * Format a date as a month label (e.g., "January 2024")
 * @param date - Date to format
 * @returns Formatted month label
 */
export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Get an array of the last N months with their ranges
 * @param n - Number of months to retrieve
 * @returns Array of month ranges with labels
 */
export function getLastNMonths(n: number): Array<{ label: string; range: MonthRange }> {
  const months: Array<{ label: string; range: MonthRange }> = [];
  const now = new Date();

  for (let i = 0; i < n; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const range = getMonthRange(date.getFullYear(), date.getMonth() + 1);
    const label = formatMonthLabel(date);
    months.push({ label, range });
  }

  return months.reverse();
}

/**
 * Get the current month's date range
 * @returns Object with start and end dates
 */
export function getCurrentMonthRange(): MonthRange {
  const now = new Date();
  return getMonthRange(now.getFullYear(), now.getMonth() + 1);
}

/**
 * Get the previous month's date range
 * @returns Object with start and end dates
 */
export function getPreviousMonthRange(): MonthRange {
  const now = new Date();
  const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
  const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  return getMonthRange(prevYear, prevMonth);
}

// ============================================================================
// DATA AGGREGATION HELPERS
// ============================================================================

/**
 * Group expenses by category and calculate totals
 * @param expensesList - Array of expense records
 * @returns Array of category breakdowns
 */
export async function groupExpensesByCategory(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<CategoryBreakdown[]> {
  const results = await db
    .select({
      categoryId: expenses.categoryId,
      categoryName: categories.name,
      categoryColor: categories.color,
      categoryIcon: categories.icon,
      total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
      count: sql<number>`COUNT(*)::int`,
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate),
        isNull(expenses.deletedAt)
      )
    )
    .groupBy(expenses.categoryId, categories.name, categories.color, categories.icon);

  const totalExpenses = results.reduce((sum, r) => sum + parseFloat(r.total), 0);

  return results.map((r) => {
    const total = parseFloat(r.total);
    return {
      categoryId: r.categoryId,
      categoryName: r.categoryName || 'Unknown',
      total,
      count: r.count,
      percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
      color: r.categoryColor || undefined,
      icon: r.categoryIcon || undefined,
    };
  });
}

/**
 * Group expenses by day for a specific period
 * @param userId - User ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of daily expense totals
 */
export async function groupExpensesByDay(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Array<{ date: string; total: number; count: number }>> {
  const results = await db
    .select({
      date: sql<string>`TO_CHAR(${expenses.date}, 'YYYY-MM-DD')`,
      total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
      count: sql<number>`COUNT(*)::int`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate),
        isNull(expenses.deletedAt)
      )
    )
    .groupBy(sql`${expenses.date}`)
    .orderBy(sql`${expenses.date}`);

  return results.map((r) => ({
    date: r.date,
    total: parseFloat(r.total),
    count: r.count,
  }));
}

/**
 * Group expenses by weekday vs weekend
 * @param userId - User ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Object with weekday and weekend totals
 */
export async function groupExpensesByWeek(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<{ weekday: number; weekend: number; weekdayCount: number; weekendCount: number }> {
  const [weekendResult] = await db
    .select({
      total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
      count: sql<number>`COUNT(*)::int`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate),
        isNull(expenses.deletedAt),
        sql`EXTRACT(DOW FROM ${expenses.date}) IN (0, 6)` // Sunday=0, Saturday=6
      )
    );

  const [weekdayResult] = await db
    .select({
      total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
      count: sql<number>`COUNT(*)::int`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate),
        isNull(expenses.deletedAt),
        sql`EXTRACT(DOW FROM ${expenses.date}) BETWEEN 1 AND 5`
      )
    );

  return {
    weekday: parseFloat(weekdayResult?.total || '0'),
    weekend: parseFloat(weekendResult?.total || '0'),
    weekdayCount: weekdayResult?.count || 0,
    weekendCount: weekendResult?.count || 0,
  };
}

/**
 * Calculate monthly average expenses over N months
 * @param userId - User ID
 * @param months - Number of months to analyze
 * @returns Average monthly expense
 */
export async function calculateMonthlyAverage(
  userId: string,
  months: number
): Promise<number> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const [result] = await db
    .select({
      total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate),
        isNull(expenses.deletedAt)
      )
    );

  const total = parseFloat(result?.total || '0');
  return months > 0 ? total / months : 0;
}

// ============================================================================
// INSIGHT GENERATION
// ============================================================================

/**
 * Generate financial insights for a user based on spending patterns
 * @param userId - User ID
 * @returns Array of insights
 */
export async function generateInsights(userId: string): Promise<Insight[]> {
  const insights: Insight[] = [];
  const currentMonth = getCurrentMonthRange();
  const previousMonth = getPreviousMonthRange();

  try {
    // Rule 1: Weekend vs Weekday Spending
    const weekData = await groupExpensesByWeek(userId, currentMonth.start, currentMonth.end);

    if (weekData.weekdayCount > 0 && weekData.weekendCount > 0) {
      const avgWeekday = weekData.weekday / Math.max(weekData.weekdayCount, 1);
      const avgWeekend = weekData.weekend / Math.max(weekData.weekendCount, 1);

      if (avgWeekend > avgWeekday * 1.3) {
        const percentageMore = Math.round(((avgWeekend - avgWeekday) / avgWeekday) * 100);
        insights.push({
          type: 'pattern',
          title: 'Higher Weekend Spending',
          message: `You spend ${percentageMore}% more per day on weekends compared to weekdays`,
          severity: 'info',
          icon: '📅',
          percentage: percentageMore,
          actionable: true,
          suggestion: 'Consider setting weekend-specific budgets or planning activities in advance.',
        });
      }
    }

    // Rule 2: Category Month-over-Month
    const currentCategories = await groupExpensesByCategory(
      userId,
      currentMonth.start,
      currentMonth.end
    );
    const previousCategories = await groupExpensesByCategory(
      userId,
      previousMonth.start,
      previousMonth.end
    );

    for (const current of currentCategories) {
      const previous = previousCategories.find((p) => p.categoryId === current.categoryId);

      if (previous && previous.total > 0) {
        const dollarChange = current.total - previous.total;
        const percentChange = (dollarChange / previous.total) * 100;

        if (Math.abs(dollarChange) > 20 && percentChange > 20) {
          insights.push({
            type: 'alert',
            title: `${current.categoryName} Spending Increased`,
            message: `Your ${current.categoryName} spending increased by $${dollarChange.toFixed(2)} (${percentChange.toFixed(0)}%)`,
            severity: 'warning',
            icon: '📈',
            amount: `$${dollarChange.toFixed(2)}`,
            percentage: Math.round(percentChange),
            actionable: true,
            suggestion: `Review your ${current.categoryName} expenses to identify unexpected costs.`,
          });
        } else if (dollarChange < -20) {
          insights.push({
            type: 'achievement',
            title: `Great Job on ${current.categoryName}!`,
            message: `You reduced ${current.categoryName} spending by $${Math.abs(dollarChange).toFixed(2)}`,
            severity: 'success',
            icon: '🎉',
            amount: `$${Math.abs(dollarChange).toFixed(2)}`,
            actionable: false,
          });
        }
      }
    }

    // Rule 3: Budget Performance
    const userBudgets = await db
      .select({
        categoryId: budgets.categoryId,
        amount: budgets.amount,
        categoryName: categories.name,
      })
      .from(budgets)
      .leftJoin(categories, eq(budgets.categoryId, categories.id))
      .where(eq(budgets.userId, userId));

    for (const budget of userBudgets) {
      const categoryExpense = currentCategories.find(
        (c) => c.categoryId === budget.categoryId
      );

      if (categoryExpense) {
        const budgetAmount = parseFloat(budget.amount);
        const percentage = (categoryExpense.total / budgetAmount) * 100;
        const overAmount = categoryExpense.total - budgetAmount;

        if (percentage >= 100) {
          insights.push({
            type: 'alert',
            title: `${budget.categoryName} Budget Exceeded`,
            message: `You've exceeded your ${budget.categoryName} budget by $${overAmount.toFixed(2)}`,
            severity: 'danger',
            icon: '⚠️',
            amount: `$${overAmount.toFixed(2)}`,
            percentage: Math.round(percentage),
            actionable: true,
            suggestion: 'Consider reducing expenses in this category for the rest of the month.',
          });
        } else if (percentage < 50) {
          insights.push({
            type: 'achievement',
            title: `Saving Well on ${budget.categoryName}`,
            message: `You're only using ${percentage.toFixed(0)}% of your ${budget.categoryName} budget`,
            severity: 'success',
            icon: '💰',
            percentage: Math.round(percentage),
            actionable: false,
          });
        }
      }
    }

    // Rule 4: Savings Rate
    const [expenseResult] = await db
      .select({
        total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, userId),
          gte(expenses.date, currentMonth.start),
          lte(expenses.date, currentMonth.end),
          isNull(expenses.deletedAt)
        )
      );

    const [incomeResult] = await db
      .select({
        total: sql<string>`COALESCE(SUM(${income.amount}), 0)`,
      })
      .from(income)
      .where(
        and(
          eq(income.userId, userId),
          gte(income.date, currentMonth.start),
          lte(income.date, currentMonth.end),
          isNull(income.deletedAt)
        )
      );

    const totalExpenses = parseFloat(expenseResult?.total || '0');
    const totalIncome = parseFloat(incomeResult?.total || '0');

    if (totalIncome > 0) {
      const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;

      if (savingsRate < 0) {
        insights.push({
          type: 'alert',
          title: 'Spending Exceeds Income',
          message: `You're spending more than you earn this month`,
          severity: 'danger',
          icon: '🚨',
          percentage: Math.round(Math.abs(savingsRate)),
          actionable: true,
          suggestion: 'Review your expenses urgently and identify areas to cut back.',
        });
      } else if (savingsRate < 10) {
        insights.push({
          type: 'suggestion',
          title: 'Low Savings Rate',
          message: `You're saving ${savingsRate.toFixed(1)}% of income. Try to save at least 20%`,
          severity: 'warning',
          icon: '💡',
          percentage: Math.round(savingsRate),
          actionable: true,
          suggestion: 'Financial experts recommend saving at least 20% of your income.',
        });
      } else if (savingsRate < 20) {
        insights.push({
          type: 'suggestion',
          title: 'Good Savings Rate',
          message: `You're saving ${savingsRate.toFixed(1)}% of income. Try to reach 20%`,
          severity: 'info',
          icon: '👍',
          percentage: Math.round(savingsRate),
          actionable: true,
          suggestion: 'You\'re doing well! Push to reach the 20% savings goal.',
        });
      } else {
        insights.push({
          type: 'achievement',
          title: 'Excellent Savings Rate!',
          message: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep it up!`,
          severity: 'success',
          icon: '🌟',
          percentage: Math.round(savingsRate),
          actionable: false,
        });
      }
    }

    // Rule 5: Unusual Expenses (Outliers by Category)
    for (const category of currentCategories) {
      const categoryExpenses = await db
        .select({
          amount: expenses.amount,
        })
        .from(expenses)
        .where(
          and(
            eq(expenses.userId, userId),
            eq(expenses.categoryId, category.categoryId),
            gte(expenses.date, currentMonth.start),
            lte(expenses.date, currentMonth.end),
            isNull(expenses.deletedAt)
          )
        );

      if (categoryExpenses.length > 2) {
        const amounts = categoryExpenses.map((e) => parseFloat(e.amount));
        const avg = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;
        const maxAmount = Math.max(...amounts);

        if (maxAmount > avg * 2) {
          insights.push({
            type: 'alert',
            title: `Unusual ${category.categoryName} Expense`,
            message: `Detected an expense 2x higher than your average in ${category.categoryName}`,
            severity: 'info',
            icon: '🔍',
            amount: `$${maxAmount.toFixed(2)}`,
            actionable: true,
            suggestion: 'Review this expense to ensure it was planned or expected.',
          });
        }
      }
    }

    // Rule 6: Recurring Cost Reminder
    const now = new Date();
    const weekFromNow = new Date(now);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    const upcomingRecurring = await db
      .select({
        description: recurringExpenses.description,
        amount: recurringExpenses.amount,
        nextOccurrence: recurringExpenses.nextOccurrence,
        categoryName: categories.name,
      })
      .from(recurringExpenses)
      .leftJoin(categories, eq(recurringExpenses.categoryId, categories.id))
      .where(
        and(
          eq(recurringExpenses.userId, userId),
          eq(recurringExpenses.isActive, true),
          gte(recurringExpenses.nextOccurrence, now),
          lte(recurringExpenses.nextOccurrence, weekFromNow)
        )
      )
      .orderBy(recurringExpenses.nextOccurrence)
      .limit(3);

    if (upcomingRecurring.length > 0) {
      const totalUpcoming = upcomingRecurring.reduce(
        (sum, r) => sum + parseFloat(r.amount),
        0
      );

      insights.push({
        type: 'alert',
        title: 'Upcoming Recurring Expenses',
        message: `You have ${upcomingRecurring.length} recurring expense${upcomingRecurring.length > 1 ? 's' : ''} due this week`,
        severity: 'info',
        icon: '🔄',
        amount: `$${totalUpcoming.toFixed(2)}`,
        actionable: true,
        details: upcomingRecurring.map((r) => ({
          description: r.description,
          amount: parseFloat(r.amount),
          date: r.nextOccurrence,
          category: r.categoryName,
        })),
        suggestion: 'Ensure you have sufficient funds available for these recurring payments.',
      });
    }

    // Rule 7: Month Projection
    const daysInMonth = new Date(
      currentMonth.end.getFullYear(),
      currentMonth.end.getMonth() + 1,
      0
    ).getDate();
    const daysPassed = now.getDate();

    if (daysPassed >= 5 && daysPassed < daysInMonth - 2 && totalExpenses > 0) {
      const projectedTotal = (totalExpenses / daysPassed) * daysInMonth;
      const projectedPercentage = totalIncome > 0 ? (projectedTotal / totalIncome) * 100 : 0;

      insights.push({
        type: 'projection',
        title: 'Month Spending Projection',
        message: `At this rate, you'll spend $${projectedTotal.toFixed(2)} this month${totalIncome > 0 ? ` (${projectedPercentage.toFixed(0)}% of income)` : ''}`,
        severity: projectedPercentage > 80 ? 'warning' : 'info',
        icon: '📊',
        amount: `$${projectedTotal.toFixed(2)}`,
        percentage: totalIncome > 0 ? Math.round(projectedPercentage) : undefined,
        actionable: projectedPercentage > 80,
        suggestion:
          projectedPercentage > 80
            ? 'Your projected spending is high. Consider reducing non-essential expenses.'
            : undefined,
      });
    }

    // Sort insights by severity
    const severityOrder: Record<string, number> = {
      danger: 0,
      warning: 1,
      info: 2,
      success: 3,
    };

    return insights.sort(
      (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
    );
  } catch (error) {
    console.error('Error generating insights:', error);
    return [];
  }
}

// ============================================================================
// CHART DATA TRANSFORMERS
// ============================================================================

/**
 * Format category breakdown data for Recharts PieChart
 * @param categoryBreakdown - Array of category breakdowns
 * @returns Formatted data for PieChart
 */
export function formatPieChartData(
  categoryBreakdown: CategoryBreakdown[]
): Array<{
  name: string;
  value: number;
  percentage: number;
  color?: string;
}> {
  return categoryBreakdown.map((category) => ({
    name: category.categoryName,
    value: category.total,
    percentage: Math.round(category.percentage * 100) / 100,
    color: category.color,
  }));
}

/**
 * Format trend data for Recharts LineChart
 * @param trends - Array of trend data points
 * @returns Formatted data for LineChart
 */
export function formatLineChartData(
  trends: Array<{
    period: string;
    expenses: { total: number; count: number };
    income: { total: number; count: number };
    netSavings: number;
  }>
): Array<{
  period: string;
  expenses: number;
  income: number;
  netSavings: number;
}> {
  return trends.map((trend) => ({
    period: trend.period,
    expenses: Math.round(trend.expenses.total * 100) / 100,
    income: Math.round(trend.income.total * 100) / 100,
    netSavings: Math.round(trend.netSavings * 100) / 100,
  }));
}

/**
 * Format comparison data for Recharts BarChart
 * @param comparison - Comparison data
 * @returns Formatted data for BarChart
 */
export function formatBarChartData(
  comparison: Array<{
    category: string;
    current: number;
    previous: number;
    change: number;
  }>
): Array<{
  category: string;
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
}> {
  return comparison.map((item) => ({
    category: item.category,
    current: Math.round(item.current * 100) / 100,
    previous: Math.round(item.previous * 100) / 100,
    change: Math.round(item.change * 100) / 100,
    changePercentage:
      item.previous > 0
        ? Math.round((item.change / item.previous) * 10000) / 100
        : 0,
  }));
}

/**
 * Format income vs expense data for comparison charts
 * @param data - Income and expense totals
 * @returns Formatted data for comparison
 */
export function formatIncomeExpenseData(data: {
  income: number;
  expenses: number;
}): Array<{ name: string; value: number; color: string }> {
  return [
    {
      name: 'Income',
      value: Math.round(data.income * 100) / 100,
      color: '#10b981', // green
    },
    {
      name: 'Expenses',
      value: Math.round(data.expenses * 100) / 100,
      color: '#ef4444', // red
    },
    {
      name: 'Net Savings',
      value: Math.round((data.income - data.expenses) * 100) / 100,
      color: data.income >= data.expenses ? '#3b82f6' : '#f59e0b', // blue or amber
    },
  ];
}

// ============================================================================
// STATISTICAL HELPERS
// ============================================================================

/**
 * Calculate average, median, and standard deviation
 * @param values - Array of numeric values
 * @returns Statistical summary
 */
export function calculateStats(values: number[]): {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
} {
  if (values.length === 0) {
    return { mean: 0, median: 0, stdDev: 0, min: 0, max: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  const median =
    values.length % 2 === 0
      ? (sorted[values.length / 2 - 1] + sorted[values.length / 2]) / 2
      : sorted[Math.floor(values.length / 2)];

  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return {
    mean: Math.round(mean * 100) / 100,
    median: Math.round(median * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
}

/**
 * Format currency value with appropriate decimals
 * @param amount - Numeric amount
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate percentage change between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change (returns 0 if previous is 0)
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 10000) / 100;
}
