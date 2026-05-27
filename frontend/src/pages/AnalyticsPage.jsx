import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { format, subMonths, addMonths } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  PieChart as PieChartIcon,
  Lightbulb,
  BarChart3,
} from 'lucide-react';
import { useSummary, useTrends, useCategoryBreakdown, useInsights, useComparison, useIncomeVsExpense } from '../hooks/useAnalytics';
import ExpensePieChart from '../components/Charts/ExpensePieChart';
import SpendingTrendChart from '../components/Charts/SpendingTrendChart';
import MonthlyComparisonChart from '../components/Charts/MonthlyComparisonChart';
import IncomeVsExpenseChart from '../components/Charts/IncomeVsExpenseChart';
import InsightsPanel from '../components/Analytics/InsightsPanel';
import CategoryBreakdown from '../components/Analytics/CategoryBreakdown';

/**
 * Analytics Page
 * Comprehensive analytics dashboard with tabbed interface
 */
function AnalyticsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State for month navigation and tabs
  const [selectedDate, setSelectedDate] = useState(new Date());
  const monthKey = format(selectedDate, 'yyyy-MM');
  const [activeTab, setActiveTab] = useState('overview');
  const [trendsPeriod, setTrendsPeriod] = useState('6months');

  // Fetch analytics data
  const { data: summaryData } = useSummary(monthKey);
  const { data: trendsData, isLoading: trendsLoading } = useTrends(trendsPeriod);
  const { data: categoryData, isLoading: categoryLoading } = useCategoryBreakdown(monthKey);
  const { data: insightsData, isLoading: insightsLoading, refetch: refetchInsights } = useInsights(monthKey);
  const { data: comparisonData, isLoading: comparisonLoading } = useComparison(monthKey);
  const { data: incomeVsExpenseData, isLoading: incomeVsExpenseLoading } = useIncomeVsExpense();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handlePrevMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(selectedDate, 1);
    const now = new Date();
    // Don't allow navigating to future months
    if (nextMonth <= now) {
      setSelectedDate(nextMonth);
    }
  };

  const handleCurrentMonth = () => {
    setSelectedDate(new Date());
  };

  const isCurrentMonth = format(selectedDate, 'yyyy-MM') === format(new Date(), 'yyyy-MM');

  // Tab configuration
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'All charts at a glance',
    },
    {
      id: 'trends',
      label: 'Trends',
      icon: TrendingUp,
      description: 'Spending patterns over time',
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: PieChartIcon,
      description: 'Detailed category breakdown',
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: Lightbulb,
      description: 'AI-powered recommendations',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">SmartExpense Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/expenses')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Expenses
              </button>
              <button
                onClick={() => navigate('/income')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Income
              </button>
              <button
                onClick={() => navigate('/budgets')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Budgets
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Month Selector */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Analytics</h2>
            <p className="text-gray-600 mt-1">
              Detailed financial insights for {format(selectedDate, 'MMMM yyyy')}
            </p>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={handleCurrentMonth}
              disabled={isCurrentMonth}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isCurrentMonth
                  ? 'bg-blue-600 text-white cursor-default'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {format(selectedDate, 'MMM yyyy')}
            </button>

            <button
              onClick={handleNextMonth}
              disabled={isCurrentMonth}
              className={`p-2 rounded-lg transition-colors ${
                isCurrentMonth
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Summary Stats Bar */}
        {summaryData?.data?.data && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                ${parseFloat(summaryData.data.data.totalExpenses).toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-green-600">
                ${parseFloat(summaryData.data.data.totalIncome).toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600 mb-1">Net Savings</p>
              <p className={`text-2xl font-bold ${
                parseFloat(summaryData.data.data.netSavings) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${parseFloat(summaryData.data.data.netSavings).toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {parseFloat(summaryData.data.data.savingsRate).toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          {/* Desktop Tabs */}
          <div className="hidden md:flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Tabs (Dropdown) */}
          <div className="md:hidden p-4">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label} - {tab.description}
                </option>
              ))}
            </select>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Pie Chart */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Spending by Category
                    </h3>
                    <ExpensePieChart
                      data={categoryData?.data?.data}
                      loading={categoryLoading}
                      currency={user?.currency || 'USD'}
                    />
                  </div>

                  {/* Spending Trends */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Spending Trends
                    </h3>
                    <SpendingTrendChart
                      data={trendsData?.data?.data}
                      loading={trendsLoading}
                      currency={user?.currency || 'USD'}
                      onPeriodChange={setTrendsPeriod}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Monthly Comparison */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Month-over-Month Comparison
                    </h3>
                    <MonthlyComparisonChart
                      data={comparisonData?.data?.data?.comparison}
                      loading={comparisonLoading}
                      currency={user?.currency || 'USD'}
                    />
                  </div>

                  {/* Income vs Expense */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Income vs Expenses (12 Months)
                    </h3>
                    <IncomeVsExpenseChart
                      data={incomeVsExpenseData?.data?.data}
                      loading={incomeVsExpenseLoading}
                      currency={user?.currency || 'USD'}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Trends Tab */}
            {activeTab === 'trends' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Spending Trends Analysis
                  </h3>
                  <div className="h-96">
                    <SpendingTrendChart
                      data={trendsData?.data?.data}
                      loading={trendsLoading}
                      currency={user?.currency || 'USD'}
                      onPeriodChange={setTrendsPeriod}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Income vs Expenses Over Time
                  </h3>
                  <div className="h-96">
                    <IncomeVsExpenseChart
                      data={incomeVsExpenseData?.data?.data}
                      loading={incomeVsExpenseLoading}
                      currency={user?.currency || 'USD'}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Month-over-Month Comparison
                  </h3>
                  <div className="h-96">
                    <MonthlyComparisonChart
                      data={comparisonData?.data?.data?.comparison}
                      loading={comparisonLoading}
                      currency={user?.currency || 'USD'}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      Category Distribution
                    </h3>
                    <div className="h-80">
                      <ExpensePieChart
                        data={categoryData?.data?.data}
                        loading={categoryLoading}
                        currency={user?.currency || 'USD'}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      Category Comparison
                    </h3>
                    <div className="h-80">
                      <MonthlyComparisonChart
                        data={comparisonData?.data?.data?.comparison}
                        loading={comparisonLoading}
                        currency={user?.currency || 'USD'}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Detailed Category Breakdown
                  </h3>
                  <CategoryBreakdown
                    categories={categoryData?.data?.data}
                    loading={categoryLoading}
                    currency={user?.currency || 'USD'}
                  />
                </div>
              </div>
            )}

            {/* Insights Tab */}
            {activeTab === 'insights' && (
              <div>
                <InsightsPanel
                  insights={insightsData?.data?.data}
                  loading={insightsLoading}
                  onRefresh={refetchInsights}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AnalyticsPage;
