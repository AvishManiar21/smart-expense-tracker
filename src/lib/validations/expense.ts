import { z } from 'zod';

export const createExpenseSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  categoryId: z.string().uuid('Invalid category ID'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  paymentMethod: z.enum(['cash', 'card', 'bank'], {
    errorMap: () => ({ message: 'Payment method must be cash, card, or bank' }),
  }).default('card'),
  receiptUrl: z.string().url('Invalid URL').optional(),
  isRecurring: z.boolean().default(false),
  recurringId: z.string().uuid().optional(),
});

export const updateExpenseSchema = z.object({
  amount: z.number().min(0.01).optional(),
  categoryId: z.string().uuid().optional(),
  description: z.string().min(1).max(500).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  paymentMethod: z.enum(['cash', 'card', 'bank']).optional(),
  receiptUrl: z.string().url().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export const expenseFiltersSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['date', 'amount', 'category']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  category: z.string().uuid().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ExpenseFilters = z.infer<typeof expenseFiltersSchema>;
