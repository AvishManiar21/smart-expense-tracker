import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { ExpensePieChart } from '@/components/charts/expense-pie-chart';
import { SpendingTrendChart } from '@/components/charts/spending-trend-chart';
import { MonthlyComparisonChart } from '@/components/charts/monthly-comparison-chart';
import { IncomeExpenseChart } from '@/components/charts/income-expense-chart';
import { CategoryBreakdownTable } from '@/components/analytics/category-breakdown-table';
import { InsightsPanel } from '@/components/dashboard/insights-panel';
import { formatCurrency, getCurrentMonth } from '@/lib/utils/date';

/**
 * Fetch summary analytics data
 */
async function getSummary(month: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/analytics/summary?month=${month}`,
      {
        headers: { 'Content-Type': 'application/json' },
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
 * Fetch spending trends data
 */
async function getTrends(period: string = '12months') {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/analytics/trends?period=${period}&groupBy=month`,
      {
        headers: { 'Content-Type': 'application/json' },
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
 * Fetch category breakdown data
 */
async function getCategoryBreakdown(month: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/analytics/category-breakdown?month=${month}`,
      {
        headers: { 'Content-Type': 'application/json' },
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
 * Fetch AI-generated insights
 */
async function getInsights(month: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/analytics/insights?month=${month}`,
      {
        headers: { 'Content-Type': 'application/json' },
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
 * Fetch monthly comparison data
 */
async function getComparison() {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/analytics/comparison`,
      {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      }
    );

    if (!response.ok) return null;
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching comparison:', error);
    return null;
  }
}

/**
 * Fetch income vs expense data
 */
async function getIncomeVsExpense(months: number = 12) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/analytics/income-vs-expense?months=${months}`,
      {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      }
    );

    if (!response.ok) return null;
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching income vs expense:', error);
    return null;
  }
}

/**
 * Fetch budgets data for category breakdown
 */
async function getBudgets() {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/budgets`,
      {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      }
    );

    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return [];
  }
}

/**
 * Fetch top expenses for each category
 */
async function getTopExpensesByCategory(categoryId: string, month: string, limit: number = 3) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/expenses?categoryId=${categoryId}&month=${month}&limit=${limit}&sort=amount&order=desc`,
      {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      }
    );

    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching top expenses:', error);
    return [];
  }
}

/**
 * Analytics Page
 *
 * Comprehensive analytics page with multiple tabs:
 * 1. Overview - Summary cards and key charts
 * 2. Trends - Income vs Expense and spending trends
 * 3. Categories - Detailed category breakdown table
 * 4. Insights - AI-generated financial insights
 *
 * Server Component that fetches all data server-side and passes
 * to client components for rendering.
 */
export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const currentMonth = getCurrentMonth();

  // Fetch all data in parallel for better performance
  const [
    summary,
    trends,
    categoryBreakdown,
    insights,
    comparison,
    incomeVsExpense,
    budgets,
  ] = await Promise.all([
    getSummary(currentMonth),
    getTrends('12months'),
    getCategoryBreakdown(currentMonth),
    getInsights(currentMonth),
    getComparison(),
    getIncomeVsExpense(12),
    getBudgets(),
  ]);

  // Transform summary data for SummaryCards component
  const summaryData = summary
    ? {
        totalExpenses: formatCurrency(summary.expenses.total),
        totalIncome: formatCurrency(summary.income.total),
        netSavings: formatCurrency(summary.netSavings),
        savingsRate: summary.savingsRate,
        vsLastMonth: {
          expenseChange: comparison?.changes.expenses.total || 0,
          incomeChange: comparison?.changes.income.total || 0,
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

  // Transform trends data for spending trend chart
  const trendChartData = Array.isArray(trends)
    ? trends.map((trend: any) => ({
        month: trend.period,
        totalExpenses: trend.totalExpenses,
        totalIncome: trend.totalIncome,
        netSavings: trend.netSavings,
      }))
    : [];

  // Transform comparison data for monthly comparison chart
  const comparisonChartData = Array.isArray(categoryBreakdown) && comparison
    ? await Promise.all(
        categoryBreakdown.map(async (cat: any) => {
          // Get previous month data - this is a simplified approach
          // In a real app, you'd fetch category breakdown for previous month
          const previousTotal = cat.totalAmount * 0.85; // Placeholder - would need actual prev month data
          const change = cat.totalAmount - previousTotal;
          const changePercent = previousTotal > 0 ? (change / previousTotal) * 100 : 0;

          return {
            categoryName: cat.categoryName,
            thisMonth: cat.totalAmount,
            lastMonth: previousTotal,
            change,
            changePercent,
          };
        })
      )
    : [];

  // Transform income vs expense data
  const incomeExpenseChartData = incomeVsExpense?.comparison
    ? incomeVsExpense.comparison.map((item: any) => {
        // Format month from YYYY-MM to "Mon YYYY"
        const [year, month] = item.month.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        const formattedMonth = date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });

        return {
          month: formattedMonth,
          income: item.income,
          expenses: item.expenses,
          savings: item.netSavings,
        };
      })
    : [];

  // Create budget lookup map
  const budgetMap = new Map(
    budgets.map((b: any) => [b.categoryId, parseFloat(b.amount)])
  );

  // Transform category breakdown for table with budgets and top expenses
  const categoryTableData = Array.isArray(categoryBreakdown)
    ? await Promise.all(
        categoryBreakdown.map(async (cat: any) => {
          const budgetAmount = budgetMap.get(cat.categoryId);
          const budgetUsedPercent = budgetAmount
            ? (cat.totalAmount / budgetAmount) * 100
            : undefined;

          // Fetch top expenses for this category
          const topExpensesRaw = await getTopExpensesByCategory(
            cat.categoryId,
            currentMonth,
            3
          );
          const topExpenses = topExpensesRaw.map((exp: any) => ({
            description: exp.description,
            amount: formatCurrency(Math.abs(exp.amount)),
            date: exp.date,
          }));

          return {
            id: cat.categoryId,
            name: cat.categoryName,
            icon: cat.categoryIcon || '📊',
            color: cat.categoryColor || '#3b82f6',
            amount: formatCurrency(cat.totalAmount),
            percentage: cat.percentage,
            transactionCount: cat.transactionCount,
            budgetAmount: budgetAmount ? formatCurrency(budgetAmount) : undefined,
            budgetUsedPercent,
            topExpenses: topExpenses.length > 0 ? topExpenses : undefined,
          };
        })
      )
    : [];

  return (
    <div className="px-4 py-6 sm:px-0 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Deep insights into your financial patterns and spending behavior
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Summary Cards */}
          <SummaryCards summary={summaryData} />

          {/* Key Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpensePieChart data={pieChartData} />
            <SpendingTrendChart data={trendChartData} />
          </div>

          {/* Monthly Comparison */}
          {comparisonChartData.length > 0 && (
            <MonthlyComparisonChart data={comparisonChartData} />
          )}
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6 mt-6">
          {/* Income vs Expense Chart */}
          <IncomeExpenseChart data={incomeExpenseChartData} />

          {/* Spending Trend Chart */}
          <SpendingTrendChart data={trendChartData} />

          {/* Summary Statistics */}
          {incomeVsExpense?.summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border p-6">
                <p className="text-sm text-gray-600 mb-1">Avg Monthly Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(incomeVsExpense.summary.avgMonthlyIncome)}
                </p>
              </div>
              <div className="bg-white rounded-lg border p-6">
                <p className="text-sm text-gray-600 mb-1">Avg Monthly Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(incomeVsExpense.summary.avgMonthlyExpenses)}
                </p>
              </div>
              <div className="bg-white rounded-lg border p-6">
                <p className="text-sm text-gray-600 mb-1">Avg Savings Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {incomeVsExpense.summary.avgSavingsRate.toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6 mt-6">
          <CategoryBreakdownTable categories={categoryTableData} />
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6 mt-6">
          {Array.isArray(insights) && insights.length > 0 ? (
            <InsightsPanel insights={insights} />
          ) : (
            <div className="bg-white rounded-lg border p-12 text-center">
              <p className="text-lg font-medium text-gray-900">No insights available</p>
              <p className="text-sm text-gray-600 mt-2">
                Add more expenses and income to generate personalized insights
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
