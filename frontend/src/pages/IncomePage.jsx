import { useState } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIncome, useCreateIncome, useUpdateIncome, useDeleteIncome } from '../hooks/useIncome';
import IncomeForm from '../components/Income/IncomeForm';
import IncomeList from '../components/Income/IncomeList';
import IncomeSummary from '../components/Income/IncomeSummary';

function IncomePage() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  const { data: incomeData, isLoading } = useIncome({});
  const createIncome = useCreateIncome();
  const updateIncome = useUpdateIncome();
  const deleteIncome = useDeleteIncome();

  const income = incomeData?.data?.income || [];

  const handleFormSubmit = async (data) => {
    try {
      if (editingIncome) {
        await updateIncome.mutateAsync({ id: editingIncome.id, data });
      } else {
        await createIncome.mutateAsync(data);
      }
      setIsFormOpen(false);
      setEditingIncome(null);
    } catch (error) {
      alert('Failed to save income: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (item) => {
    setEditingIncome(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        await deleteIncome.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete income');
      }
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingIncome(null);
  };

  const handleAddNew = () => {
    setEditingIncome(null);
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
                <h1 className="text-3xl font-bold text-gray-900">Income</h1>
                <p className="mt-1 text-sm text-gray-600">Track your income sources</p>
              </div>
            </div>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Income
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading income data...</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <IncomeSummary income={income} />

            {/* Income List */}
            <IncomeList
              income={income}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={deleteIncome.isPending}
            />
          </>
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
                {editingIncome ? 'Edit Income' : 'Add Income'}
              </h3>
              <IncomeForm
                income={editingIncome}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={createIncome.isPending || updateIncome.isPending}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IncomePage;
