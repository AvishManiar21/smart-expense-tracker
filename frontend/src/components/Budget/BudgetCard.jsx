import PropTypes from 'prop-types';
import { format, differenceInDays } from 'date-fns';
import BudgetProgressBar from './BudgetProgressBar';

export default function BudgetCard({ budget, onEdit, onDelete, isDeleting }) {
  const {
    category,
    amount: budgetAmount,
    spentAmount = 0,
    percentageUsed = 0,
    period,
    startDate,
    endDate,
  } = budget;

  const remainingAmount = parseFloat(budgetAmount) - parseFloat(spentAmount);
  const daysLeft = differenceInDays(new Date(endDate), new Date());

  const getStatusBadge = () => {
    if (percentageUsed >= 100) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Exceeded
        </span>
      );
    }
    if (percentageUsed >= 70) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Warning
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Good
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{category?.name || 'Unknown'}</h3>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-gray-500 capitalize">{period} Budget</p>
        </div>
      </div>

      {/* Progress Bar */}
      <BudgetProgressBar percentage={percentageUsed} />

      {/* Budget Details */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Budget</p>
          <p className="text-lg font-semibold text-gray-900">
            ${parseFloat(budgetAmount).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Spent</p>
          <p className="text-lg font-semibold text-gray-900">
            ${parseFloat(spentAmount).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Remaining</p>
          <p className={`text-lg font-semibold ${remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(remainingAmount).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Days Left</p>
          <p className="text-lg font-semibold text-gray-900">
            {daysLeft > 0 ? daysLeft : 0}
          </p>
        </div>
      </div>

      {/* Period Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {format(new Date(startDate), 'MMM dd, yyyy')} - {format(new Date(endDate), 'MMM dd, yyyy')}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={() => onEdit(budget)}
          className="text-sm text-blue-600 hover:text-blue-900 font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(budget.id)}
          disabled={isDeleting}
          className="text-sm text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

BudgetCard.propTypes = {
  budget: PropTypes.shape({
    id: PropTypes.string.isRequired,
    category: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    spentAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    percentageUsed: PropTypes.number,
    period: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
};
