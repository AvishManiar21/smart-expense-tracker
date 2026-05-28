'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExpenseTable } from './expense-table';
import { ExpenseDialog } from './expense-dialog';
import { ExpenseFilters } from './expense-filters';
import { formatDate, formatCurrency } from '@/lib/utils/date';

export type Expense = {
  id: string;
  amount: string;
  categoryId: string;
  description: string;
  date: Date;
  paymentMethod: string;
  receiptUrl?: string | null;
  isRecurring: boolean;
  createdAt: Date;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  } | null;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export function ExpensesClient() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [pagination.page, filters]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.category && { category: filters.category }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.minAmount && { minAmount: filters.minAmount }),
        ...(filters.maxAmount && { maxAmount: filters.maxAmount }),
      });

      const res = await fetch(`/api/expenses?${params}`);
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.data || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingExpense(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchExpenses();
      } else {
        alert('Failed to delete expense');
      }
    } catch (error) {
      console.error('Failed to delete expense:', error);
      alert('Failed to delete expense');
    }
  };

  const handleSave = async () => {
    setIsDialogOpen(false);
    fetchExpenses();
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
        <Button onClick={handleCreate}>
          + Add Expense
        </Button>
      </div>

      <ExpenseFilters
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <Card className="mt-4">
        <CardContent className="p-0">
          <ExpenseTable
            expenses={expenses}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={pagination}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          />
        </CardContent>
      </Card>

      <ExpenseDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        expense={editingExpense}
        categories={categories}
      />
    </div>
  );
}
