import {
  getMonthExpenses,
  getMonthIncome,
  groupByCategory,
  generateInsights,
} from '../services/analytics.service.js';
import { prisma } from '../server.js';
import { startOfMonth, endOfMonth, subMonths, format, differenceInDays } from 'date-fns';
import { asyncHandler } from '../middleware/asyncHandler.js';

/**
 * Get monthly summary with key metrics
 * @route GET /api/analytics/summary
 * @query month - YYYY-MM format (default: current month)
 * @access Private
 */
export const getSummary = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const monthParam = req.query.month;

  // Parse month or use current
  let year, month;
  if (monthParam) {
    [year, month] = monthParam.split('-').map(Number);
  } else {
    const now = new Date();
    year = now.getFullYear();
    month = now.getMonth() + 1;
  }

  // Get current month data
  const expenses = await getMonthExpenses(userId, year, month);
  const income = await getMonthIncome(userId, year, month);

  // Get previous month data for comparison
  const prevDate = subMonths(new Date(year, month - 1), 1);
  const prevExpenses = await getMonthExpenses(userId, prevDate.getFullYear(), prevDate.getMonth() + 1);
  const prevIncome = await getMonthIncome(userId, prevDate.getFullYear(), prevDate.getMonth() + 1);

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);
  const totalIncome = income.reduce((sum, i) => sum + parseFloat(i.amount.toString()), 0);
  const prevTotalExpenses = prevExpenses.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);
  const prevTotalIncome = prevIncome.reduce((sum, i) => sum + parseFloat(i.amount.toString()), 0);

  // Net savings and rate
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // Top category
  const categoryGroups = groupByCategory(expenses);
  const topCategory = categoryGroups.length > 0
    ? {
        name: categoryGroups[0].categoryName,
        amount: categoryGroups[0].amount,
        percentage: categoryGroups[0].percentage,
      }
    : null;

  // Budget status
  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: { category: true },
  });

  let budgetStatus = { onTrack: 0, warning: 0, exceeded: 0 };

  for (const budget of budgets) {
    const spent = expenses
      .filter((e) => e.categoryId === budget.categoryId)
      .reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);

    const budgetAmount = parseFloat(budget.amount.toString());
    const percentUsed = (spent / budgetAmount) * 100;

    if (percentUsed >= 100) {
      budgetStatus.exceeded += 1;
    } else if (percentUsed >= 70) {
      budgetStatus.warning += 1;
    } else {
      budgetStatus.onTrack += 1;
    }
  }

  // Month-over-month changes
  const expenseChange = prevTotalExpenses > 0
    ? ((totalExpenses - prevTotalExpenses) / prevTotalExpenses) * 100
    : 0;
  const incomeChange = prevTotalIncome > 0
    ? ((totalIncome - prevTotalIncome) / prevTotalIncome) * 100
    : 0;

  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(new Date(year, month - 1));

  res.status(200).json({
    success: true,
    data: {
      period: {
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(endDate, 'yyyy-MM-dd'),
      },
      totalExpenses: totalExpenses.toFixed(2),
      totalIncome: totalIncome.toFixed(2),
      netSavings: netSavings.toFixed(2),
      savingsRate: savingsRate.toFixed(2),
      expenseCount: expenses.length,
      topCategory,
      budgetStatus,
      vsLastMonth: {
        expenseChange: expenseChange.toFixed(2),
        incomeChange: incomeChange.toFixed(2),
      },
    },
  });
});

/**
 * Get spending trends over time
 * @route GET /api/analytics/trends
 * @query period - 3months, 6months, 12months (default: 6months)
 * @query startDate - Custom start date (YYYY-MM-DD)
 * @query endDate - Custom end date (YYYY-MM-DD)
 * @access Private
 */
export const getTrends = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const period = req.query.period || '6months';

  let monthsToFetch;
  switch (period) {
    case '3months':
      monthsToFetch = 3;
      break;
    case '12months':
      monthsToFetch = 12;
      break;
    default:
      monthsToFetch = 6;
  }

  const trends = [];
  const now = new Date();

  for (let i = monthsToFetch - 1; i >= 0; i--) {
    const date = subMonths(now, i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const expenses = await getMonthExpenses(userId, year, month);
    const income = await getMonthIncome(userId, year, month);

    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);
    const totalIncome = income.reduce((sum, i) => sum + parseFloat(i.amount.toString()), 0);
    const netSavings = totalIncome - totalExpenses;

    trends.push({
      month: format(date, 'MMM yyyy'),
      monthKey: format(date, 'yyyy-MM'),
      totalExpenses: parseFloat(totalExpenses.toFixed(2)),
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      netSavings: parseFloat(netSavings.toFixed(2)),
    });
  }

  res.status(200).json({
    success: true,
    data: trends,
  });
});

/**
 * Get category breakdown for a month
 * @route GET /api/analytics/category-breakdown
 * @query month - YYYY-MM format (default: current month)
 * @access Private
 */
export const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const monthParam = req.query.month;

  // Parse month or use current
  let year, month;
  if (monthParam) {
    [year, month] = monthParam.split('-').map(Number);
  } else {
    const now = new Date();
    year = now.getFullYear();
    month = now.getMonth() + 1;
  }

  const expenses = await getMonthExpenses(userId, year, month);
  const categoryGroups = groupByCategory(expenses);

  // Enrich with budget data
  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: { category: true },
  });

  const enrichedCategories = categoryGroups.map((cat) => {
    const budget = budgets.find((b) => b.categoryId === cat.categoryId);
    const spent = parseFloat(cat.amount);

    if (budget) {
      const budgetAmount = parseFloat(budget.amount.toString());
      const budgetPercentageUsed = (spent / budgetAmount) * 100;

      return {
        ...cat,
        budgetAmount: budgetAmount.toFixed(2),
        budgetPercentageUsed: budgetPercentageUsed.toFixed(2),
        status: budgetPercentageUsed >= 100 ? 'exceeded' : budgetPercentageUsed >= 70 ? 'warning' : 'good',
      };
    }

    return {
      ...cat,
      budgetAmount: null,
      budgetPercentageUsed: null,
      status: 'none',
    };
  });

  res.status(200).json({
    success: true,
    data: enrichedCategories,
  });
});

/**
 * Get AI-powered insights
 * @route GET /api/analytics/insights
 * @query month - YYYY-MM format (default: current month)
 * @access Private
 */
export const getInsights = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const monthParam = req.query.month;

  // Parse month or use current
  let year, month;
  if (monthParam) {
    [year, month] = monthParam.split('-').map(Number);
  } else {
    const now = new Date();
    year = now.getFullYear();
    month = now.getMonth() + 1;
  }

  const insights = await generateInsights(userId, year, month);

  res.status(200).json({
    success: true,
    data: insights,
  });
});

/**
 * Get month-over-month comparison by category
 * @route GET /api/analytics/comparison
 * @query month - YYYY-MM format (default: current month)
 * @access Private
 */
export const getComparison = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const monthParam = req.query.month;

  // Parse month or use current
  let year, month;
  if (monthParam) {
    [year, month] = monthParam.split('-').map(Number);
  } else {
    const now = new Date();
    year = now.getFullYear();
    month = now.getMonth() + 1;
  }

  // Get current and previous month data
  const currentExpenses = await getMonthExpenses(userId, year, month);
  const prevDate = subMonths(new Date(year, month - 1), 1);
  const prevExpenses = await getMonthExpenses(userId, prevDate.getFullYear(), prevDate.getMonth() + 1);

  const currentCategories = groupByCategory(currentExpenses);
  const prevCategories = groupByCategory(prevExpenses);

  // Combine and compare
  const allCategories = new Set([
    ...currentCategories.map((c) => c.categoryId),
    ...prevCategories.map((c) => c.categoryId),
  ]);

  const comparison = Array.from(allCategories).map((categoryId) => {
    const current = currentCategories.find((c) => c.categoryId === categoryId);
    const prev = prevCategories.find((c) => c.categoryId === categoryId);

    const currentAmount = current ? parseFloat(current.amount) : 0;
    const prevAmount = prev ? parseFloat(prev.amount) : 0;
    const change = currentAmount - prevAmount;
    const percentChange = prevAmount > 0 ? (change / prevAmount) * 100 : (currentAmount > 0 ? 100 : 0);

    return {
      categoryId,
      categoryName: current?.categoryName || prev?.categoryName || 'Unknown',
      categoryIcon: current?.categoryIcon || prev?.categoryIcon || '📦',
      categoryColor: current?.categoryColor || prev?.categoryColor || '#AEB6BF',
      thisMonth: currentAmount.toFixed(2),
      lastMonth: prevAmount.toFixed(2),
      change: change.toFixed(2),
      percentChange: percentChange.toFixed(2),
    };
  });

  // Sort by absolute change (biggest changes first)
  comparison.sort((a, b) => Math.abs(parseFloat(b.change)) - Math.abs(parseFloat(a.change)));

  res.status(200).json({
    success: true,
    data: {
      currentMonth: format(new Date(year, month - 1), 'MMMM yyyy'),
      previousMonth: format(prevDate, 'MMMM yyyy'),
      comparison,
    },
  });
});

/**
 * Get income vs expense comparison for last 12 months
 * @route GET /api/analytics/income-vs-expense
 * @access Private
 */
export const getIncomeVsExpense = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const data = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = subMonths(now, i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const expenses = await getMonthExpenses(userId, year, month);
    const income = await getMonthIncome(userId, year, month);

    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);
    const totalIncome = income.reduce((sum, i) => sum + parseFloat(i.amount.toString()), 0);
    const savings = totalIncome - totalExpenses;

    data.push({
      month: format(date, 'MMM yy'),
      monthFull: format(date, 'MMMM yyyy'),
      income: parseFloat(totalIncome.toFixed(2)),
      expenses: parseFloat(totalExpenses.toFixed(2)),
      savings: parseFloat(savings.toFixed(2)),
    });
  }

  res.status(200).json({
    success: true,
    data,
  });
});
