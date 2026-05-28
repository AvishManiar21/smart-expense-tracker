import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📊</span> Summary Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Financial summary for any time period with income, expenses, and savings rate
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">GET /api/analytics/summary</code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📈</span> Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Spending and income trends over time with month/week/day grouping
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">GET /api/analytics/trends</code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🎯</span> Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Detailed expense breakdown by category with percentages
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">GET /api/analytics/category-breakdown</code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>💡</span> AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              7 intelligent insights: weekend spending, category changes, budget alerts, and more
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">GET /api/analytics/insights</code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>⚖️</span> Period Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Compare financial metrics between two time periods
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">GET /api/analytics/comparison</code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>💰</span> Income vs Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Monthly comparison of income vs expenses with savings rate
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">GET /api/analytics/income-vs-expense</code>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Analytics Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Data Insights</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>✅ Weekend vs weekday spending patterns</li>
                <li>✅ Month-over-month category changes</li>
                <li>✅ Budget performance tracking</li>
                <li>✅ Savings rate analysis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Visualizations</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>✅ Trend charts (line, bar)</li>
                <li>✅ Category pie charts</li>
                <li>✅ Income vs expense graphs</li>
                <li>✅ Budget progress bars</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Chart components will be added in the next phase. All data endpoints
              are fully functional and ready to power your analytics dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
