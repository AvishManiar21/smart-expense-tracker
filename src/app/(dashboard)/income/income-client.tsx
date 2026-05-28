'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IncomeTable } from './income-table';
import { IncomeDialog } from './income-dialog';
import { IncomeFilters } from './income-filters';

export type Income = {
  id: string;
  amount: string;
  source: string;
  description?: string | null;
  date: Date;
  isRecurring: boolean;
  createdAt: Date;
};

export function IncomeClient() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });

  useEffect(() => {
    fetchIncomes();
  }, [pagination.page, filters]);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.minAmount && { minAmount: filters.minAmount }),
        ...(filters.maxAmount && { maxAmount: filters.maxAmount }),
      });

      const res = await fetch(`/api/income?${params}`);
      if (res.ok) {
        const data = await res.json();
        setIncomes(data.data || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to fetch income:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingIncome(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this income?')) return;

    try {
      const res = await fetch(`/api/income/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchIncomes();
      } else {
        alert('Failed to delete income');
      }
    } catch (error) {
      console.error('Failed to delete income:', error);
      alert('Failed to delete income');
    }
  };

  const handleSave = async () => {
    setIsDialogOpen(false);
    fetchIncomes();
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Income</h2>
        <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
          + Add Income
        </Button>
      </div>

      <IncomeFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <Card className="mt-4">
        <CardContent className="p-0">
          <IncomeTable
            incomes={incomes}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={pagination}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          />
        </CardContent>
      </Card>

      <IncomeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        income={editingIncome}
      />
    </div>
  );
}
