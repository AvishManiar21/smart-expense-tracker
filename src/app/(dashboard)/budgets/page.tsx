import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function BudgetsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Budgets</h2>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
          + Create Budget
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-600 mb-4">
              Budget management UI coming soon!
            </p>
            <p className="text-sm text-gray-500">
              The API endpoint is ready at <code className="bg-gray-100 px-2 py-1 rounded">GET /api/budgets</code>
            </p>
            <div className="mt-6 text-left max-w-md mx-auto bg-gray-50 p-4 rounded-md">
              <p className="font-semibold mb-2">Available Features:</p>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>✅ List budgets with spending calculations</li>
                <li>✅ Create category-specific budgets</li>
                <li>✅ Real-time budget vs actual tracking</li>
                <li>✅ Budget status summary endpoint</li>
                <li>✅ Alert system for threshold breaches</li>
                <li>✅ Monthly and custom period budgets</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
