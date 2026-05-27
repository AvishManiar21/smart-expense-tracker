import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { format, subMonths, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import { useSummary, useTrends, useCategoryBreakdown, useInsights } from '../hooks/useAnalytics';
import { useExpenses } from '../hooks/useExpenses';
import { useBudgetAlerts } from '../hooks/useBudgets';
import SummaryCards from '../components/Dashboard/SummaryCards';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import ExpensePieChart from '../components/Charts/ExpensePieChart';
import SpendingTrendChart from '../components/Charts/SpendingTrendChart';
import InsightsPanel from '../components/Analytics/InsightsPanel';
import BudgetAlerts from '../components/Budget/BudgetAlerts';

/**
 * Dashboard Page
 * Main analytics dashboard with summary cards, charts, and insights
 */
function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State for month navigation
  const [selectedDate, setSelectedDate] = useState(new Date());
  const monthKey = format(selectedDate, 'yyyy-MM');
  const [trendsPeriod, setTrendsPeriod] = useState('6months');

  // Fetch analytics data
  const { data: summaryData, isLoading: summaryLoading } = useSummary(monthKey);
  const { data: trendsData, isLoading: trendsLoading } = useTrends(trendsPeriod);
  const { data: categoryData, isLoading: categoryLoading } = useCategoryBreakdown(monthKey);
  const { data: insightsData, isLoading: insightsLoading, refetch: refetchInsights } = useInsights(monthKey);

  // Fetch recent transactions
  const { data: expensesData, isLoading: expensesLoading } = useExpenses({
    page: 1,
    limit: 10,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Fetch budget alerts
  const { data: alertsData } = useBudgetAlerts();

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
                onClick={() => navigate('/analytics')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Analytics
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
        {/* Welcome & Month Selector */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-gray-600 mt-1">
              Here's your financial overview for {format(selectedDate, 'MMMM yyyy')}
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

        {/* Budget Alerts */}
        {alertsData?.data?.alerts && alertsData.data.alerts.length > 0 && (
          <div className="mb-8">
            <BudgetAlerts alerts={alertsData.data.alerts} />
          </div>
        )}

        {/* Summary Cards */}
        <div className="mb-8">
          <SummaryCards
            summary={summaryData?.data}
            loading={summaryLoading}
            currency={user?.currency || 'USD'}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Spending by Category
            </h3>
            <ExpensePieChart
              data={categoryData?.data}
              loading={categoryLoading}
              currency={user?.currency || 'USD'}
            />
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Spending Trends
            </h3>
            <SpendingTrendChart
              data={trendsData?.data}
              loading={trendsLoading}
              currency={user?.currency || 'USD'}
              onPeriodChange={setTrendsPeriod}
            />
          </div>
        </div>

        {/* AI Insights */}
        <div className="mb-8">
          <InsightsPanel
            insights={insightsData?.data}
            loading={insightsLoading}
            onRefresh={refetchInsights}
          />
        </div>

        {/* Recent Transactions */}
        <div>
          <RecentTransactions
            transactions={expensesData?.data?.data || []}
            loading={expensesLoading}
            currency={user?.currency || 'USD'}
          />
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
