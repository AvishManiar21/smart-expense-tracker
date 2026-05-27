import prisma from '../config/database.js';
import { startOfMonth, endOfMonth, subMonths, format, differenceInDays } from 'date-fns';

/**
 * Analytics Service
 * Helper functions for data aggregation and financial analysis
 */

/**
 * Get all expenses for a specific month
 * @param {string} userId - User ID
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @returns {Promise<Array>} Array of expenses
 */
export async function getMonthExpenses(userId, year, month) {
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(new Date(year, month - 1));

  return await prisma.expense.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
      deletedAt: null,
    },
    include: {
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
}

/**
 * Get all income for a specific month
 * @param {string} userId - User ID
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @returns {Promise<Array>} Array of income entries
 */
export async function getMonthIncome(userId, year, month) {
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(new Date(year, month - 1));

  return await prisma.income.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
      deletedAt: null,
    },
    orderBy: {
      date: 'desc',
    },
  });
}

/**
 * Group expenses by category with totals
 * @param {Array} expenses - Array of expenses
 * @returns {Array} Grouped expenses by category
 */
export function groupByCategory(expenses) {
  const grouped = {};

  expenses.forEach((expense) => {
    const categoryId = expense.categoryId;
    const categoryName = expense.category?.name || 'Uncategorized';
    const categoryColor = expense.category?.color || '#AEB6BF';
    const categoryIcon = expense.category?.icon || '📦';

    if (!grouped[categoryId]) {
      grouped[categoryId] = {
        categoryId,
        categoryName,
        categoryColor,
        categoryIcon,
        amount: 0,
        count: 0,
      };
    }

    grouped[categoryId].amount += parseFloat(expense.amount.toString());
    grouped[categoryId].count += 1;
  });

  // Convert to array and calculate percentages
  const total = Object.values(grouped).reduce((sum, cat) => sum + cat.amount, 0);

  return Object.values(grouped)
    .map((cat) => ({
      ...cat,
      amount: cat.amount.toFixed(2),
      percentage: total > 0 ? ((cat.amount / total) * 100).toFixed(2) : 0,
    }))
    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
}

/**
 * Group expenses by day
 * @param {Array} expenses - Array of expenses
 * @returns {Object} Expenses grouped by day
 */
export function groupByDay(expenses) {
  const grouped = {};

  expenses.forEach((expense) => {
    const day = format(new Date(expense.date), 'yyyy-MM-dd');

    if (!grouped[day]) {
      grouped[day] = {
        date: day,
        amount: 0,
        count: 0,
      };
    }

    grouped[day].amount += parseFloat(expense.amount.toString());
    grouped[day].count += 1;
  });

  return grouped;
}

/**
 * Group expenses by week
 * @param {Array} expenses - Array of expenses
 * @returns {Object} Expenses grouped by week
 */
export function groupByWeek(expenses) {
  const grouped = {
    weekday: { total: 0, count: 0 },
    weekend: { total: 0, count: 0 },
  };

  expenses.forEach((expense) => {
    const day = new Date(expense.date).getDay();
    const isWeekend = day === 0 || day === 6; // Sunday or Saturday
    const amount = parseFloat(expense.amount.toString());

    if (isWeekend) {
      grouped.weekend.total += amount;
      grouped.weekend.count += 1;
    } else {
      grouped.weekday.total += amount;
      grouped.weekday.count += 1;
    }
  });

  return grouped;
}

/**
 * Calculate trends over multiple months
 * @param {Array} monthsData - Array of monthly data
 * @returns {Array} Trend analysis
 */
export function calculateTrends(monthsData) {
  return monthsData.map((month, index) => {
    if (index === 0) {
      return { ...month, trend: 0 };
    }

    const prevMonth = monthsData[index - 1];
    const change = month.totalExpenses - prevMonth.totalExpenses;
    const percentChange = prevMonth.totalExpenses > 0
      ? ((change / prevMonth.totalExpenses) * 100).toFixed(2)
      : 0;

    return {
      ...month,
      trend: percentChange,
      changeAmount: change.toFixed(2),
    };
  });
}

/**
 * Generate AI-powered insights based on spending patterns
 * @param {string} userId - User ID
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @returns {Promise<Array>} Array of insight objects
 */
export async function generateInsights(userId, year, month) {
  const insights = [];

  try {
    // Get current month and previous month data
    const currentExpenses = await getMonthExpenses(userId, year, month);
    const currentIncome = await getMonthIncome(userId, year, month);

    const prevDate = subMonths(new Date(year, month - 1), 1);
    const prevExpenses = await getMonthExpenses(userId, prevDate.getFullYear(), prevDate.getMonth() + 1);
    const prevIncome = await getMonthIncome(userId, prevDate.getFullYear(), prevDate.getMonth() + 1);

    // Calculate totals
    const currentExpenseTotal = currentExpenses.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);
    const currentIncomeTotal = currentIncome.reduce((sum, i) => sum + parseFloat(i.amount.toString()), 0);
    const prevExpenseTotal = prevExpenses.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);

    // RULE 1: Weekend vs Weekday Spending
    const weekdayWeekendData = groupByWeek(currentExpenses);
    const weekdayAvg = weekdayWeekendData.weekday.count > 0
      ? weekdayWeekendData.weekday.total / weekdayWeekendData.weekday.count
      : 0;
    const weekendAvg = weekdayWeekendData.weekend.count > 0
      ? weekdayWeekendData.weekend.total / weekdayWeekendData.weekend.count
      : 0;

    if (weekendAvg > weekdayAvg * 1.3 && weekdayWeekendData.weekend.count > 0) {
      const percentMore = ((weekendAvg / weekdayAvg - 1) * 100).toFixed(0);
      insights.push({
        type: 'pattern',
        title: 'Weekend Spending Pattern',
        message: `You spend ${percentMore}% more on weekends ($${weekendAvg.toFixed(2)} avg) compared to weekdays ($${weekdayAvg.toFixed(2)} avg). Consider planning weekend activities in advance.`,
        severity: 'info',
        icon: '📊',
        percentage: percentMore,
      });
    }

    // RULE 2: Category Month-over-Month
    const currentCategories = groupByCategory(currentExpenses);
    const prevCategories = groupByCategory(prevExpenses);

    currentCategories.forEach((current) => {
      const prev = prevCategories.find((p) => p.categoryId === current.categoryId);
      if (prev) {
        const change = parseFloat(current.amount) - parseFloat(prev.amount);
        const percentChange = (change / parseFloat(prev.amount)) * 100;

        if (Math.abs(change) > 20 && Math.abs(percentChange) > 20) {
          if (change > 0) {
            insights.push({
              type: 'alert',
              title: `Increased ${current.categoryName} Spending`,
              message: `Your ${current.categoryName} spending increased by $${change.toFixed(2)} (${percentChange.toFixed(0)}%) this month.`,
              severity: 'warning',
              icon: '📈',
              amount: change.toFixed(2),
              percentage: percentChange.toFixed(2),
            });
          } else {
            insights.push({
              type: 'achievement',
              title: `Reduced ${current.categoryName} Spending`,
              message: `Great! You reduced ${current.categoryName} spending by $${Math.abs(change).toFixed(2)} (${Math.abs(percentChange).toFixed(0)}%) this month.`,
              severity: 'success',
              icon: '🎉',
              amount: Math.abs(change).toFixed(2),
              percentage: Math.abs(percentChange).toFixed(2),
            });
          }
        }
      }
    });

    // RULE 3: Budget Performance
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: { category: true },
    });

    for (const budget of budgets) {
      const spent = currentExpenses
        .filter((e) => e.categoryId === budget.categoryId)
        .reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);

      const budgetAmount = parseFloat(budget.amount.toString());
      const percentUsed = (spent / budgetAmount) * 100;

      if (percentUsed >= 100) {
        insights.push({
          type: 'alert',
          title: 'Budget Exceeded',
          message: `You've exceeded your ${budget.category.name} budget by $${(spent - budgetAmount).toFixed(2)} (${(percentUsed - 100).toFixed(0)}% over).`,
          severity: 'danger',
          icon: '🚨',
          amount: (spent - budgetAmount).toFixed(2),
        });
      } else if (percentUsed < 50 && spent > 0) {
        insights.push({
          type: 'achievement',
          title: 'Budget On Track',
          message: `You're saving well on ${budget.category.name}! Only ${percentUsed.toFixed(0)}% of budget used.`,
          severity: 'success',
          icon: '💚',
        });
      }
    }

    // RULE 4: Savings Rate
    if (currentIncomeTotal > 0) {
      const netSavings = currentIncomeTotal - currentExpenseTotal;
      const savingsRate = (netSavings / currentIncomeTotal) * 100;

      if (savingsRate < 0) {
        insights.push({
          type: 'alert',
          title: 'Spending Exceeds Income',
          message: `You're spending more than you earn this month. Consider reviewing your expenses.`,
          severity: 'danger',
          icon: '⚠️',
          amount: Math.abs(netSavings).toFixed(2),
        });
      } else if (savingsRate < 10) {
        insights.push({
          type: 'suggestion',
          title: 'Low Savings Rate',
          message: `Your savings rate is ${savingsRate.toFixed(1)}%. Try to save at least 20% of your income.`,
          severity: 'warning',
          icon: '💡',
          percentage: savingsRate.toFixed(1),
        });
      } else if (savingsRate >= 20) {
        insights.push({
          type: 'achievement',
          title: 'Excellent Savings!',
          message: `You're saving ${savingsRate.toFixed(1)}% of your income this month. Keep up the great work!`,
          severity: 'success',
          icon: '🌟',
          percentage: savingsRate.toFixed(1),
        });
      }
    }

    // RULE 5: Unusual Expenses (Outliers)
    currentCategories.forEach((category) => {
      const categoryExpenses = currentExpenses.filter((e) => e.categoryId === category.categoryId);
      if (categoryExpenses.length > 3) {
        const amounts = categoryExpenses.map((e) => parseFloat(e.amount.toString()));
        const avg = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;

        const outliers = categoryExpenses.filter((e) => parseFloat(e.amount.toString()) > avg * 2);

        if (outliers.length > 0) {
          outliers.forEach((outlier) => {
            insights.push({
              type: 'alert',
              title: 'Unusual Expense Detected',
              message: `Large ${category.categoryName} expense of $${parseFloat(outlier.amount.toString()).toFixed(2)} detected (${outlier.description}).`,
              severity: 'info',
              icon: '🔍',
              amount: parseFloat(outlier.amount.toString()).toFixed(2),
            });
          });
        }
      }
    });

    // RULE 6: Recurring Cost Reminders
    const upcomingRecurring = await prisma.recurringExpense.findMany({
      where: {
        userId,
        isActive: true,
        nextOccurrence: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
        },
      },
      include: { category: true },
    });

    if (upcomingRecurring.length > 0) {
      const total = upcomingRecurring.reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0);
      insights.push({
        type: 'alert',
        title: 'Upcoming Recurring Expenses',
        message: `${upcomingRecurring.length} recurring expense(s) totaling $${total.toFixed(2)} are due in the next 7 days.`,
        severity: 'info',
        icon: '🔔',
        amount: total.toFixed(2),
      });
    }

    // RULE 7: Month Projection
    const today = new Date();
    const daysInMonth = endOfMonth(new Date(year, month - 1)).getDate();
    const daysPassed = today.getMonth() + 1 === month && today.getFullYear() === year
      ? today.getDate()
      : daysInMonth;

    if (daysPassed < daysInMonth && daysPassed > 0) {
      const projectedTotal = (currentExpenseTotal / daysPassed) * daysInMonth;
      const projectedVsIncome = currentIncomeTotal > 0
        ? (projectedTotal / currentIncomeTotal) * 100
        : 0;

      insights.push({
        type: 'projection',
        title: 'Monthly Spending Projection',
        message: `At this rate, you'll spend $${projectedTotal.toFixed(2)} this month (${projectedVsIncome.toFixed(0)}% of income).`,
        severity: projectedVsIncome > 90 ? 'warning' : 'info',
        icon: '📈',
        amount: projectedTotal.toFixed(2),
        percentage: projectedVsIncome.toFixed(1),
      });
    }

  } catch (error) {
    console.error('Error generating insights:', error);
  }

  // Sort by severity: danger > warning > info > success
  const severityOrder = { danger: 0, warning: 1, info: 2, success: 3 };
  return insights.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}
