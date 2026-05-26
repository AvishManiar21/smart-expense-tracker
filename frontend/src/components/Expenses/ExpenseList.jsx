import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * ExpenseList Component
 * Displays expenses in a table (desktop) or card view (mobile)
 * with pagination controls
 */
function ExpenseList({ expenses, pagination, onEdit, onDelete, onPageChange, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">💸</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No expenses found</h3>
        <p className="text-gray-500 mb-6">Start tracking your expenses by adding your first one!</p>
      </div>
    );
  }

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      onPageChange(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.pages) {
      onPageChange(pagination.page + 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(expense.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full mr-2"
                      style={{ backgroundColor: expense.category.color + '20' }}
                    >
                      {expense.category.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {expense.category.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {expense.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                    {expense.paymentMethod}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">
                  ${parseFloat(expense.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(expense)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                    title="Edit expense"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <span
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full mr-3 flex-shrink-0"
                  style={{ backgroundColor: expense.category.color + '20' }}
                >
                  {expense.category.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{expense.category.name}</p>
                  <p className="text-sm text-gray-600 truncate">{expense.description}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                    <span className="mx-2">•</span>
                    <span className="capitalize">{expense.paymentMethod}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end ml-4">
                <p className="text-lg font-bold text-gray-900">
                  ${parseFloat(expense.amount).toFixed(2)}
                </p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => onEdit(expense)}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={handlePreviousPage}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={pagination.page === pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={handlePreviousPage}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={pagination.page === pagination.pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ExpenseList.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      description: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      paymentMethod: PropTypes.string.isRequired,
      category: PropTypes.shape({
        name: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
      }).isRequired,
    })
  ),
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
  }),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

ExpenseList.defaultProps = {
  expenses: [],
  pagination: null,
  isLoading: false,
};

export default ExpenseList;
