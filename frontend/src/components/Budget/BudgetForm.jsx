import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useCategories } from '../../hooks/useCategories';

const PERIODS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export default function BudgetForm({ budget, onSubmit, onCancel, isLoading }) {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = categoriesData?.data?.categories || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: budget
      ? {
          categoryId: budget.categoryId,
          amount: budget.amount,
          period: budget.period,
        }
      : {
          categoryId: '',
          amount: '',
          period: 'monthly',
        },
  });

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      amount: data.amount, // Keep as string for precise decimal handling
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Category */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <select
          id="categoryId"
          {...register('categoryId', { required: 'Category is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading || categoriesLoading || !!budget}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
        )}
        {budget && (
          <p className="mt-1 text-xs text-gray-500">Category cannot be changed after creation</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Budget Amount *
        </label>
        <input
          type="number"
          id="amount"
          step="0.01"
          min="0.01"
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' },
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0.00"
          disabled={isLoading}
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      {/* Period */}
      <div>
        <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
          Period *
        </label>
        <select
          id="period"
          {...register('period', { required: 'Period is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        >
          {PERIODS.map((period) => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>
        {errors.period && (
          <p className="mt-1 text-sm text-red-600">{errors.period.message}</p>
        )}
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> Budget periods are calculated automatically. Monthly budgets run from the 1st to the last day of each month, and yearly budgets run from January 1st to December 31st.
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || categoriesLoading}
        >
          {isLoading ? 'Saving...' : budget ? 'Update Budget' : 'Create Budget'}
        </button>
      </div>
    </form>
  );
}

BudgetForm.propTypes = {
  budget: PropTypes.shape({
    id: PropTypes.string,
    categoryId: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    period: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
