import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ExpensesClient } from './expenses-client';

export default async function ExpensesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <ExpensesClient />
    </div>
  );
}
