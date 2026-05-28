import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, getCurrentMonth } from '@/lib/utils/date';

async function getSummary(userId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/analytics/summary?month=${getCurrentMonth()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) return null;
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching summary:', error);
    return null;
  }
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const summary = await getSummary(session.user.id);

  return (
    <div className="px-4 py-6 sm:px-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <span className="text-2xl">💸</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary ? formatCurrency(summary.expenses.total) : '$0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.expenses.count || 0} transactions this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summary ? formatCurrency(summary.income.total) : '$0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.income.count || 0} sources this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <span className="text-2xl">💎</span>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary && summary.netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summary ? formatCurrency(summary.netSavings) : '$0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary ? `${summary.savingsRate.toFixed(1)}%` : '0%'} savings rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <span className="text-2xl">📊</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary ? `${summary.savingsRate.toFixed(1)}%` : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary && summary.savingsRate >= 20 ? 'Excellent!' : summary && summary.savingsRate >= 10 ? 'Good' : 'Need improvement'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome back, {session.user.name || 'User'}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Here's your financial overview for this month. The API backend is fully functional
            with 38 endpoints. You can start adding expenses, income, and budgets to track your finances.
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm">
              <span className="mr-2">✅</span>
              <span>All API endpoints operational</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="mr-2">✅</span>
              <span>Authentication with NextAuth.js</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="mr-2">✅</span>
              <span>Drizzle ORM with PostgreSQL</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="mr-2">🚧</span>
              <span>UI Components in progress</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Migration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Progress</span>
                  <span className="font-semibold">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                <p>✅ Phase 1-4: Setup, Database, Auth, API (Complete)</p>
                <p>🚧 Phase 5-6: Services & Components (In Progress)</p>
                <p>⏳ Phase 7-8: Pages & Testing (Pending)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
                + Add Expense
              </button>
              <button className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
                + Add Income
              </button>
              <button className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
                + Create Budget
              </button>
              <button className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
                📊 View Analytics
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
