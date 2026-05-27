import { useState } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useBudgetStatus,
  useBudgetAlerts,
  useCreateBudget,
  useUpdateBudget,
  useDeleteBudget
} from '../hooks/useBudgets';
import BudgetCard from '../components/Budget/BudgetCard';
import BudgetForm from '../components/Budget/BudgetForm';
import BudgetAlerts from '../components/Budget/BudgetAlerts';

function BudgetPage() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const { data: budgetData, isLoading } = useBudgetStatus();
  const { data: alertsData } = useBudgetAlerts();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();

  const budgets = budgetData?.data?.budgets || [];
  const alerts = alertsData?.data || [];

  // Flatten alerts array (exceeded and warning)
  const allAlerts = [
    ...(Array.isArray(alerts.exceeded) ? alerts.exceeded : []),
    ...(Array.isArray(alerts.warning) ? alerts.warning : []),
  ];

  const handleFormSubmit = async (data) => {
    try {
      if (editingBudget) {
        await updateBudget.mutateAsync({ id: editingBudget.id, data });
      } else {
        await createBudget.mutateAsync(data);
      }
      setIsFormOpen(false);
      setEditingBudget(null);
    } catch (error) {
      alert('Failed to save budget: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete budget');
      }
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingBudget(null);
  };

  const handleAddNew = () => {
    setEditingBudget(null);
    setIsFormOpen(true);
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
                <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
                <p className="mt-1 text-sm text-gray-600">Track spending against your budgets</p>
              </div>
            </div>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Budget
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Budget Alerts */}
        <BudgetAlerts alerts={allAlerts} />

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading budgets...</p>
          </div>
        ) : budgets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No budgets yet. Create your first budget to start tracking your spending!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deleteBudget.isPending}
              />
            ))}
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
                {editingBudget ? 'Edit Budget' : 'Create Budget'}
              </h3>
              <BudgetForm
                budget={editingBudget}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={createBudget.isPending || updateBudget.isPending}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetPage;
