import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { IncomeClient } from './income-client';

export default async function IncomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <IncomeClient />
    </div>
  );
}
