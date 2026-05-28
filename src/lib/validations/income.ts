import { z } from 'zod';

export const createIncomeSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  source: z.string().min(1, 'Source is required').max(255, 'Source too long'),
  description: z.string().max(500, 'Description too long').optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  isRecurring: z.boolean().default(false),
});

export const updateIncomeSchema = z.object({
  amount: z.number().min(0.01).optional(),
  source: z.string().min(1).max(255).optional(),
  description: z.string().max(500).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  isRecurring: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export type CreateIncomeInput = z.infer<typeof createIncomeSchema>;
export type UpdateIncomeInput = z.infer<typeof updateIncomeSchema>;
