import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SummaryCards } from '@/components/features/dashboard/summary-cards';
import { ExpensePieChart } from '@/components/features/dashboard/expense-pie-chart';
import { SpendingTrendChart } from '@/components/features/dashboard/spending-trend-chart';
import { InsightsPanel } from '@/components/features/dashboard/insights-panel';
import { RecentTransactions } from '@/components/features/dashboard/recent-transactions';
import { formatCurrency, getCurrentMonth } from '@/lib/utils/date';

/**
 * Fetch summary analytics data
 */
async function getSummary(userId: string, month: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/analytics/summary?month=${month}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) return null;
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching summary:', error);
    return null;
  }
}

/**
 * Fetch category breakdown data
 */
async function getCategoryBreakdown(userId: string, month: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/analytics/category-breakdown?month=${month}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching category breakdown:', error);
    return [];
  }
}

/**
 * Fetch spending trends data
 */
async function getTrends(userId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/analytics/trends?period=6months&groupBy=month`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching trends:', error);
    return [];
  }
}

/**
 * Fetch AI insights
 */
async function getInsights(userId: string, month: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/analytics/insights?month=${month}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) return [];
    const result = await response.json();
    return result.data?.insights || [];
  } catch (error) {
    console.error('Error fetching insights:', error);
    return [];
  }
}

/**
 * Fetch recent transactions
 */
async function getRecentTransactions(userId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/expenses?limit=10&sort=date&order=desc`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return [];
  }
}

/**
 * Dashboard Page
 *
 * Main dashboard view displaying:
 * - Summary cards (expenses, income, savings, savings rate)
 * - Expense breakdown pie chart
 * - Spending trends line chart
 * - AI-generated insights
 * - Recent transactions list
 *
 * Server Component that fetches all data server-side and passes
 * to client components for rendering.
 */
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const currentMonth = getCurrentMonth();

  // Fetch all data in parallel for better performance
  const [summary, categoryBreakdown, trends, insights, recentTransactions] = await Promise.all([
    getSummary(session.user.id, currentMonth),
    getCategoryBreakdown(session.user.id, currentMonth),
    getTrends(session.user.id),
    getInsights(session.user.id, currentMonth),
    getRecentTransactions(session.user.id),
  ]);

  // Transform summary data for SummaryCards component
  const summaryData = summary
    ? {
        totalExpenses: formatCurrency(summary.expenses.total),
        totalIncome: formatCurrency(summary.income.total),
        netSavings: formatCurrency(summary.netSavings),
        savingsRate: summary.savingsRate,
        vsLastMonth: {
          expenseChange: 0, // TODO: Calculate from comparison endpoint
          incomeChange: 0, // TODO: Calculate from comparison endpoint
        },
      }
    : {
        totalExpenses: '$0.00',
        totalIncome: '$0.00',
        netSavings: '$0.00',
        savingsRate: 0,
        vsLastMonth: {
          expenseChange: 0,
          incomeChange: 0,
        },
      };

  // Transform category breakdown for pie chart
  const pieChartData = Array.isArray(categoryBreakdown)
    ? categoryBreakdown.map((cat: any) => ({
        categoryName: cat.categoryName,
        categoryColor: cat.categoryColor || '#3b82f6',
        amount: formatCurrency(cat.totalAmount),
        percentage: cat.percentage,
      }))
    : [];

  // Transform trends data for line chart
  const lineChartData = Array.isArray(trends)
    ? trends.map((trend: any) => ({
        month: trend.period,
        totalExpenses: trend.totalExpenses,
        totalIncome: trend.totalIncome,
        netSavings: trend.netSavings,
      }))
    : [];

  // Transform transactions for recent transactions component
  const transactionsData = Array.isArray(recentTransactions)
    ? recentTransactions.map((tx: any) => ({
        id: tx.id,
        type: tx.type || 'expense',
        amount: formatCurrency(Math.abs(tx.amount)),
        description: tx.description,
        categoryName: tx.categoryName,
        categoryIcon: tx.categoryIcon,
        categoryColor: tx.categoryColor,
        date: tx.date,
      }))
    : [];

  return (
    <div className="px-4 py-6 sm:px-0 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {session.user.name || 'User'}! Here's your financial overview.
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summaryData} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensePieChart data={pieChartData} />
        <SpendingTrendChart data={lineChartData} />
      </div>

      {/* Insights Panel */}
      {Array.isArray(insights) && insights.length > 0 && (
        <InsightsPanel insights={insights} />
      )}

      {/* Recent Transactions */}
      <RecentTransactions transactions={transactionsData} />
    </div>
  );
}
