import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Recent Transactions Component
 * Displays the last 10 transactions (expenses and income)
 */
export default function RecentTransactions({ transactions, loading, currency = 'USD' }) {
  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm">No recent transactions</p>
          <Link
            to="/expenses"
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first expense
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <Link
          to="/expenses"
          className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Transaction list */}
      <div className="space-y-4">
        {transactions.map((transaction) => {
          const isExpense = transaction.type === 'expense' || !transaction.source;
          const amount = parseFloat(transaction.amount);
          const categoryIcon = transaction.category?.icon || (isExpense ? '💰' : '💵');
          const categoryName = transaction.category?.name || transaction.source || 'Unknown';
          const categoryColor = transaction.category?.color || '#6b7280';

          return (
            <div
              key={transaction.id}
              className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
            >
              {/* Category Icon */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: `${categoryColor}20` }}
              >
                {categoryIcon}
              </div>

              {/* Transaction Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {transaction.description}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{categoryName}</span>
                  <span>•</span>
                  <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <p
                  className={`text-sm font-semibold ${
                    isExpense ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {isExpense ? '-' : '+'}${amount.toFixed(2)}
                </p>
                {transaction.paymentMethod && (
                  <p className="text-xs text-gray-500 capitalize">
                    {transaction.paymentMethod}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

RecentTransactions.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      description: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      type: PropTypes.string,
      source: PropTypes.string,
      paymentMethod: PropTypes.string,
      category: PropTypes.shape({
        name: PropTypes.string,
        icon: PropTypes.string,
        color: PropTypes.string,
      }),
    })
  ),
  loading: PropTypes.bool,
  currency: PropTypes.string,
};
