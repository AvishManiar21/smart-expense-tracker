'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BudgetCard } from './budget-card';
import { BudgetDialog } from './budget-dialog';

export type Budget = {
  id: string;
  categoryId: string;
  amount: string;
  period: string;
  startDate: Date;
  endDate?: Date | null;
  createdAt: Date;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  } | null;
  spent: number;
  remaining: number;
  percentUsed: number;
  status: 'safe' | 'warning' | 'danger';
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export function BudgetsClient() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchBudgets();
  }, []);

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

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/budgets/status');
      if (res.ok) {
        const data = await res.json();
        setBudgets(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBudget(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    try {
      const res = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchBudgets();
      } else {
        alert('Failed to delete budget');
      }
    } catch (error) {
      console.error('Failed to delete budget:', error);
      alert('Failed to delete budget');
    }
  };

  const handleSave = async () => {
    setIsDialogOpen(false);
    fetchBudgets();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Loading budgets...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Budgets</h2>
        <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
          + Create Budget
        </Button>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <div className="text-gray-600">No budgets found</div>
          <p className="text-sm text-gray-500 mt-2">Create your first budget to track spending</p>
          <Button onClick={handleCreate} className="mt-4">
            Create Budget
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <BudgetDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        budget={editingBudget}
        categories={categories}
      />
    </div>
  );
}
