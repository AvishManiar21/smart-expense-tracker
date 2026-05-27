import PropTypes from 'prop-types';

/**
 * Category Breakdown Component
 * Displays detailed category spending analysis in table format
 */
export default function CategoryBreakdown({ categories, loading, currency = 'USD' }) {
  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <p className="text-sm">No category data for this period</p>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalSpent = categories.reduce((sum, cat) => sum + parseFloat(cat.amount), 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
        <p className="text-sm text-gray-600 mt-1">
          Total spent across {categories.length} {categories.length === 1 ? 'category' : 'categories'}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                % of Total
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Budget
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const amount = parseFloat(category.amount);
              const percentage = parseFloat(category.percentage);
              const budgetAmount = category.budgetAmount ? parseFloat(category.budgetAmount) : null;
              const budgetUsed = category.budgetPercentageUsed
                ? parseFloat(category.budgetPercentageUsed)
                : null;

              // Status configuration
              const getStatusConfig = (status) => {
                switch (status) {
                  case 'exceeded':
                    return { text: 'Exceeded', class: 'bg-red-100 text-red-800' };
                  case 'warning':
                    return { text: 'Warning', class: 'bg-yellow-100 text-yellow-800' };
                  case 'good':
                    return { text: 'On Track', class: 'bg-green-100 text-green-800' };
                  default:
                    return { text: 'No Budget', class: 'bg-gray-100 text-gray-600' };
                }
              };

              const statusConfig = getStatusConfig(category.status);

              return (
                <tr key={category.categoryId} className="border-b border-gray-100 hover:bg-gray-50">
                  {/* Category */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: `${category.categoryColor}20` }}
                      >
                        {category.categoryIcon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {category.categoryName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {category.count} {category.count === 1 ? 'transaction' : 'transactions'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${amount.toFixed(2)}
                    </p>
                  </td>

                  {/* Percentage */}
                  <td className="py-4 px-4 text-right">
                    <p className="text-sm text-gray-700">{percentage.toFixed(1)}%</p>
                  </td>

                  {/* Budget */}
                  <td className="py-4 px-4 text-right">
                    {budgetAmount ? (
                      <div>
                        <p className="text-sm text-gray-700">${budgetAmount.toFixed(2)}</p>
                        {budgetUsed !== null && (
                          <div className="mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  budgetUsed >= 100
                                    ? 'bg-red-600'
                                    : budgetUsed >= 70
                                    ? 'bg-yellow-600'
                                    : 'bg-green-600'
                                }`}
                                style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {budgetUsed.toFixed(0)}% used
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">-</p>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusConfig.class}`}
                    >
                      {statusConfig.text}
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* Totals Row */}
            <tr className="bg-gray-50 font-semibold">
              <td className="py-4 px-4">
                <p className="text-sm text-gray-900">Total</p>
              </td>
              <td className="py-4 px-4 text-right">
                <p className="text-sm text-gray-900">${totalSpent.toFixed(2)}</p>
              </td>
              <td className="py-4 px-4 text-right">
                <p className="text-sm text-gray-900">100.0%</p>
              </td>
              <td className="py-4 px-4"></td>
              <td className="py-4 px-4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

CategoryBreakdown.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      categoryId: PropTypes.string.isRequired,
      categoryName: PropTypes.string.isRequired,
      categoryIcon: PropTypes.string,
      categoryColor: PropTypes.string,
      amount: PropTypes.string.isRequired,
      percentage: PropTypes.string.isRequired,
      count: PropTypes.number,
      budgetAmount: PropTypes.string,
      budgetPercentageUsed: PropTypes.string,
      status: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  currency: PropTypes.string,
};
