import { useState } from 'react';
import { Plus, ArrowLeft, Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import {
  useRecurring,
  useCreateRecurring,
  useUpdateRecurring,
  useDeleteRecurring,
  useProcessRecurring,
} from '../hooks/useRecurring';
import { useCategories } from '../hooks/useCategories';

const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

function RecurringPage() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState(null);

  const { data: recurringData, isLoading } = useRecurring();
  const { data: categoriesData } = useCategories();
  const createRecurring = useCreateRecurring();
  const updateRecurring = useUpdateRecurring();
  const deleteRecurring = useDeleteRecurring();
  const processRecurring = useProcessRecurring();

  const recurringExpenses = recurringData?.data?.recurring || [];
  const categories = categoriesData?.data?.categories || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      amount: '',
      categoryId: '',
      description: '',
      frequency: 'monthly',
      startDate: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        amount: data.amount, // Keep as string for precise decimal handling
      };

      if (editingRecurring) {
        await updateRecurring.mutateAsync({ id: editingRecurring.id, data: payload });
      } else {
        await createRecurring.mutateAsync(payload);
      }

      setIsFormOpen(false);
      setEditingRecurring(null);
      reset();
    } catch (error) {
      alert('Failed to save recurring expense: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (recurring) => {
    setEditingRecurring(recurring);
    reset({
      amount: recurring.amount,
      categoryId: recurring.categoryId,
      description: recurring.description,
      frequency: recurring.frequency,
      startDate: recurring.nextOccurrence ? format(new Date(recurring.nextOccurrence), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    });
    setIsFormOpen(true);
  };

  const handleToggleActive = async (recurring) => {
    try {
      await updateRecurring.mutateAsync({
        id: recurring.id,
        data: { isActive: !recurring.isActive },
      });
    } catch (error) {
      alert('Failed to toggle recurring expense');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recurring expense?')) {
      try {
        await deleteRecurring.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete recurring expense');
      }
    }
  };

  const handleProcessDue = async () => {
    if (window.confirm('This will create expenses for all due recurring templates. Continue?')) {
      try {
        const result = await processRecurring.mutateAsync();
        alert(`Successfully created ${result.data?.processed || 0} expense(s) from recurring templates.`);
      } catch (error) {
        alert('Failed to process recurring expenses');
      }
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingRecurring(null);
    reset();
  };

  const handleAddNew = () => {
    setEditingRecurring(null);
    reset({
      amount: '',
      categoryId: '',
      description: '',
      frequency: 'monthly',
      startDate: format(new Date(), 'yyyy-MM-dd'),
    });
    setIsFormOpen(true);
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Recurring Expenses</h1>
                <p className="mt-1 text-sm text-gray-600">Manage recurring expense templates</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleProcessDue}
                disabled={processRecurring.isPending}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Play className="w-5 h-5 mr-2" />
                Process Due
              </button>
              <button
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading recurring expenses...</p>
          </div>
        ) : recurringExpenses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">
              No recurring expense templates yet. Add your first template to automate expense tracking!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Occurrence
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recurringExpenses.map((recurring) => {
                    const category = getCategoryInfo(recurring.categoryId);
                    return (
                      <tr key={recurring.id} className={recurring.isActive ? '' : 'bg-gray-50 opacity-60'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleActive(recurring)}
                            className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                              recurring.isActive
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {recurring.isActive ? (
                              <>
                                <Play className="w-3 h-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <Pause className="w-3 h-3 mr-1" />
                                Paused
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {category && (
                              <>
                                <span className="text-lg mr-2">{category.icon}</span>
                                <span className="text-sm font-medium text-gray-900">{category.name}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{recurring.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                          ${parseFloat(recurring.amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {recurring.frequency}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                          {format(new Date(recurring.nextOccurrence), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(recurring)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(recurring.id)}
                            disabled={deleteRecurring.isPending}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {recurringExpenses.map((recurring) => {
                const category = getCategoryInfo(recurring.categoryId);
                return (
                  <div
                    key={recurring.id}
                    className={`p-4 ${recurring.isActive ? '' : 'bg-gray-50 opacity-60'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {category && (
                            <span className="text-lg">{category.icon}</span>
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {category?.name || 'Unknown'}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {recurring.frequency}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 mb-1">{recurring.description}</p>
                        <p className="text-xs text-gray-500">
                          Next: {format(new Date(recurring.nextOccurrence), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-semibold text-gray-900">
                          ${parseFloat(recurring.amount).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleToggleActive(recurring)}
                          className={`mt-1 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            recurring.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {recurring.isActive ? 'Active' : 'Paused'}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(recurring)}
                        className="text-sm text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(recurring.id)}
                        disabled={deleteRecurring.isPending}
                        className="text-sm text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleFormCancel}
            ></div>
            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {editingRecurring ? 'Edit Recurring Expense' : 'Add Recurring Expense'}
              </h3>
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                {/* Amount */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount *
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
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="categoryId"
                    {...register('categoryId', { required: 'Category is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
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
                    Description *
                  </label>
                  <input
                    type="text"
                    id="description"
                    {...register('description', {
                      required: 'Description is required',
                      maxLength: { value: 500, message: 'Description must not exceed 500 characters' },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter description"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                {/* Frequency */}
                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency *
                  </label>
                  <select
                    id="frequency"
                    {...register('frequency', { required: 'Frequency is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {FREQUENCIES.map((freq) => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                  {errors.frequency && (
                    <p className="mt-1 text-sm text-red-600">{errors.frequency.message}</p>
                  )}
                </div>

                {/* Start Date */}
                {!editingRecurring && (
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      {...register('startDate')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleFormCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={createRecurring.isPending || updateRecurring.isPending}
                  >
                    {createRecurring.isPending || updateRecurring.isPending
                      ? 'Saving...'
                      : editingRecurring
                      ? 'Update Template'
                      : 'Add Template'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecurringPage;
