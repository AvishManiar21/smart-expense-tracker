import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function IncomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Income</h2>
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          + Add Income
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-gray-600 mb-4">
              Income tracking UI coming soon!
            </p>
            <p className="text-sm text-gray-500">
              The API endpoint is ready at <code className="bg-gray-100 px-2 py-1 rounded">GET /api/income</code>
            </p>
            <div className="mt-6 text-left max-w-md mx-auto bg-gray-50 p-4 rounded-md">
              <p className="font-semibold mb-2">Available Features:</p>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>✅ List income with pagination</li>
                <li>✅ Filter by date range and amount</li>
                <li>✅ Create, update, delete income</li>
                <li>✅ Recurring income support</li>
                <li>✅ Category tagging</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
