'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/date';
import {
  ArrowRight,
  ShoppingBag,
  Home,
  Car,
  Utensils,
  Heart,
  Briefcase,
  DollarSign,
} from 'lucide-react';

/**
 * Props for the RecentTransactions component
 * @interface RecentTransactionsProps
 * @property {Array} transactions - Recent transaction records
 * @property {string} transactions[].id - Unique transaction ID
 * @property {string} transactions[].type - Transaction type ('expense' or 'income')
 * @property {string} transactions[].amount - Formatted amount string
 * @property {string} transactions[].description - Transaction description
 * @property {string} [transactions[].categoryName] - Category name (optional)
 * @property {string} [transactions[].categoryIcon] - Category icon identifier (optional)
 * @property {string} [transactions[].categoryColor] - Category color hex (optional)
 * @property {string} transactions[].date - Transaction date (ISO string)
 */
interface RecentTransactionsProps {
  transactions: Array<{
    id: string;
    type: 'expense' | 'income';
    amount: string;
    description: string;
    categoryName?: string;
    categoryIcon?: string;
    categoryColor?: string;
    date: string;
  }>;
}

/**
 * Get icon component based on category icon string
 */
const getCategoryIcon = (iconStr?: string) => {
  const iconProps = {
    className: 'h-4 w-4',
  };

  if (!iconStr) {
    return <DollarSign {...iconProps} />;
  }

  // Map common icon strings to components
  switch (iconStr.toLowerCase()) {
    case 'shopping-bag':
    case 'shopping':
      return <ShoppingBag {...iconProps} />;
    case 'home':
    case 'house':
      return <Home {...iconProps} />;
    case 'car':
    case 'transport':
      return <Car {...iconProps} />;
    case 'utensils':
    case 'food':
    case 'dining':
      return <Utensils {...iconProps} />;
    case 'heart':
    case 'health':
      return <Heart {...iconProps} />;
    case 'briefcase':
    case 'work':
      return <Briefcase {...iconProps} />;
    case 'dollar-sign':
    case 'money':
    default:
      return <DollarSign {...iconProps} />;
  }
};

/**
 * Loading skeleton component for transactions list
 */
const TransactionsSkeleton = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="h-6 bg-gray-200 rounded w-20" />
        </div>
      ))}
    </div>
  );
};

/**
 * Recent Transactions Component
 *
 * Displays the most recent transactions (expenses and income) in a list format.
 * Each transaction shows:
 * - Category icon with color-coded background
 * - Category name and description
 * - Transaction date
 * - Amount (color-coded: red for expenses, green for income)
 * - Type badge
 *
 * Features:
 * - Responsive layout
 * - Color-coded amounts (red for expenses, green for income)
 * - Category icons with colored backgrounds
 * - "View all" link to full transactions page
 * - Empty state when no transactions exist
 * - Loading skeleton for async data
 * - Hover effects for better UX
 *
 * @param {RecentTransactionsProps} props - Component props
 * @returns {JSX.Element} Recent transactions card
 */
export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  // Empty state
  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-gray-400 mb-3">
              <DollarSign className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600 font-medium">No transactions yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Start tracking your expenses and income to see them here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Transactions</span>
          <Link
            href="/expenses"
            className="text-sm font-normal text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const isExpense = transaction.type === 'expense';
            const categoryColor = transaction.categoryColor || '#3b82f6';

            return (
              <div
                key={transaction.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Category Icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${categoryColor}20`,
                    color: categoryColor,
                  }}
                >
                  {getCategoryIcon(transaction.categoryIcon)}
                </div>

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {transaction.categoryName && (
                      <span className="text-sm font-medium text-gray-900">
                        {transaction.categoryName}
                      </span>
                    )}
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        isExpense
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {isExpense ? 'Expense' : 'Income'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(transaction.date)}
                  </p>
                </div>

                {/* Amount */}
                <div
                  className={`text-sm font-semibold flex-shrink-0 ${
                    isExpense ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {isExpense ? '-' : '+'}
                  {transaction.amount}
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button (Mobile-friendly) */}
        <div className="mt-4 pt-4 border-t">
          <Link
            href="/expenses"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            View all transactions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Export loading skeleton for use in parent components
 */
export { TransactionsSkeleton };
