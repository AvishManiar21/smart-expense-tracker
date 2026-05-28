import { z } from 'zod';

export const createRecurringExpenseSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  categoryId: z.string().uuid('Invalid category ID'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'yearly'], {
    errorMap: () => ({ message: 'Invalid frequency' }),
  }),
  nextOccurrence: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Next occurrence must be in YYYY-MM-DD format'),
  isActive: z.boolean().default(true),
});

export const updateRecurringExpenseSchema = z.object({
  amount: z.number().min(0.01).optional(),
  categoryId: z.string().uuid().optional(),
  description: z.string().min(1).max(500).optional(),
  frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'yearly']).optional(),
  nextOccurrence: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  isActive: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export type CreateRecurringExpenseInput = z.infer<typeof createRecurringExpenseSchema>;
export type UpdateRecurringExpenseInput = z.infer<typeof updateRecurringExpenseSchema>;
