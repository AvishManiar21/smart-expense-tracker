'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Income } from './income-client';

const incomeFormSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  source: z.string().min(1, 'Source is required').max(255),
  description: z.string().max(500).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  isRecurring: z.boolean(),
});

type IncomeFormData = z.infer<typeof incomeFormSchema>;

type IncomeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  income: Income | null;
};

export function IncomeDialog({
  isOpen,
  onClose,
  onSave,
  income,
}: IncomeDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      amount: 0,
      source: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
    },
  });

  useEffect(() => {
    if (income) {
      setValue('amount', Number(income.amount));
      setValue('source', income.source);
      setValue('description', income.description || '');
      setValue('date', new Date(income.date).toISOString().split('T')[0]);
      setValue('isRecurring', income.isRecurring);
    } else {
      reset({
        amount: 0,
        source: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        isRecurring: false,
      });
    }
  }, [income, setValue, reset]);

  const onSubmit = async (data: IncomeFormData) => {
    try {
      const url = income ? `/api/income/${income.id}` : '/api/income';
      const method = income ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        onSave();
        onClose();
        reset();
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to save income');
      }
    } catch (error) {
      console.error('Failed to save income:', error);
      alert('Failed to save income');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{income ? 'Edit Income' : 'Add New Income'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source *</Label>
            <Input
              id="source"
              placeholder="e.g., Salary, Freelance, Investment"
              {...register('source')}
            />
            {errors.source && (
              <p className="text-sm text-red-600">{errors.source.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Additional details (optional)"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
            />
            {errors.date && (
              <p className="text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isRecurring"
              {...register('isRecurring')}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isRecurring" className="font-normal">
              This is a recurring income
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : income ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
