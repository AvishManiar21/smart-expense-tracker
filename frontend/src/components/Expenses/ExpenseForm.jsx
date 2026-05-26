import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { format } from 'date-fns';

/**
 * ExpenseForm Component
 * Form for creating and editing expenses
 */
function ExpenseForm({ expense, categories, onSubmit, onCancel, isLoading }) {
  const isEditMode = !!expense;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      amount: '',
      categoryId: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      paymentMethod: 'card',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (expense) {
      setValue('amount', expense.amount);
      setValue('categoryId', expense.categoryId);
      setValue('description', expense.description);
      setValue('date', format(new Date(expense.date), 'yyyy-MM-dd'));
      setValue('paymentMethod', expense.paymentMethod);
    }
  }, [expense, setValue]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      amount: parseFloat(data.amount),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onCancel}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Expense' : 'Add New Expense'}
              </h3>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white px-6 py-6">
            <div className="space-y-5">
              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    min="0.01"
                    {...register('amount', {
                      required: 'Amount is required',
                      min: { value: 0.01, message: 'Amount must be greater than 0' },
                    })}
                    className={`w-full pl-7 pr-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoryId"
                  {...register('categoryId', { required: 'Category is required' })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.categoryId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="description"
                  {...register('description', {
                    required: 'Description is required',
                    maxLength: { value: 500, message: 'Description must not exceed 500 characters' },
                  })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="What did you spend on?"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  {...register('date', { required: 'Date is required' })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {['cash', 'card', 'bank'].map((method) => (
                    <label key={method} className="inline-flex items-center mr-6">
                      <input
                        type="radio"
                        value={method}
                        {...register('paymentMethod', { required: 'Payment method is required' })}
                        className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{method}</span>
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Saving...' : isEditMode ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

ExpenseForm.propTypes = {
  expense: PropTypes.shape({
    id: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    categoryId: PropTypes.string,
    description: PropTypes.string,
    date: PropTypes.string,
    paymentMethod: PropTypes.string,
  }),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

ExpenseForm.defaultProps = {
  expense: null,
  categories: [],
  isLoading: false,
};

export default ExpenseForm;
