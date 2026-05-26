import React, { useState } from 'react';
import { Plus, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExpenseList from '../components/Expenses/ExpenseList';
import ExpenseFilters from '../components/Expenses/ExpenseFilters';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import { useExpenses, useCreateExpense, useUpdateExpense, useDeleteExpense } from '../hooks/useExpenses';
import { useCategories } from '../hooks/useCategories';

/**
 * ExpensesPage Component
 * Main page for managing expenses
 */
function ExpensesPage() {
  const navigate = useNavigate();

  // State for filters and pagination
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    categoryId: '',
    paymentMethod: '',
    minAmount: '',
    maxAmount: '',
    search: '',
    page: 1,
    limit: 20,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // State for form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Fetch expenses and categories
  const { data: expensesData, isLoading: isLoadingExpenses } = useExpenses(filters);
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();

  // Mutations
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  const expenses = expensesData?.data || [];
  const pagination = expensesData?.pagination;
  const summary = expensesData?.summary;
  const categories = categoriesData?.data?.categories || [];

  // Handlers
  const handleFiltersChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 }); // Reset to page 1 when filters change
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete expense: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingExpense) {
        // Update existing expense
        await updateExpense.mutateAsync({
          id: editingExpense.id,
          data,
        });
      } else {
        // Create new expense
        await createExpense.mutateAsync(data);
      }
      setIsFormOpen(false);
      setEditingExpense(null);
    } catch (error) {
      alert('Failed to save expense: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
                <p className="mt-1 text-sm text-gray-600">Track and manage your expenses</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddExpense}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Expense
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-indigo-50 overflow-hidden rounded-lg px-4 py-5 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-3xl">💰</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Amount</dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      ${summary?.totalAmount ? parseFloat(summary.totalAmount).toFixed(2) : '0.00'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-green-50 overflow-hidden rounded-lg px-4 py-5 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-3xl">📊</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                    <dd className="text-2xl font-bold text-gray-900">{summary?.count || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 overflow-hidden rounded-lg px-4 py-5 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-3xl">📈</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Average</dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      $
                      {summary?.count > 0
                        ? (parseFloat(summary.totalAmount) / summary.count).toFixed(2)
                        : '0.00'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ExpenseFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              categories={categories}
            />
          </div>

          {/* Expense List */}
          <div className="lg:col-span-3">
            <ExpenseList
              expenses={expenses}
              pagination={pagination}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              onPageChange={handlePageChange}
              isLoading={isLoadingExpenses}
            />
          </div>
        </div>
      </div>

      {/* Expense Form Modal */}
      {isFormOpen && (
        <ExpenseForm
          expense={editingExpense}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={createExpense.isLoading || updateExpense.isLoading}
        />
      )}

      {/* Floating Add Button (Mobile) */}
      <button
        onClick={handleAddExpense}
        className="fixed bottom-6 right-6 md:hidden inline-flex items-center justify-center w-14 h-14 rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

export default ExpensesPage;
