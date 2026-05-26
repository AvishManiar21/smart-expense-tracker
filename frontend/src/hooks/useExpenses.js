import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  bulkImportExpenses,
} from '../services/expense.service';

/**
 * Fetch expenses with filters and pagination
 * @param {Object} filters - Query parameters
 * @returns {Object} Query result with expenses data
 */
export function useExpenses(filters = {}) {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => getExpenses(filters),
    staleTime: 30000, // 30 seconds
    keepPreviousData: true, // Keep previous data while fetching new page
  });
}

/**
 * Fetch single expense by ID
 * @param {string} id - Expense ID
 * @returns {Object} Query result with expense data
 */
export function useExpense(id) {
  return useQuery({
    queryKey: ['expense', id],
    queryFn: () => getExpense(id),
    enabled: !!id, // Only fetch if ID is provided
    staleTime: 30000,
  });
}

/**
 * Create expense mutation
 * @returns {Object} Mutation result
 */
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      // Invalidate and refetch expenses list
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}

/**
 * Update expense mutation
 * @returns {Object} Mutation result
 */
export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateExpense(id, data),
    onSuccess: (data, variables) => {
      // Invalidate specific expense and expenses list
      queryClient.invalidateQueries({ queryKey: ['expense', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}

/**
 * Delete expense mutation
 * @returns {Object} Mutation result
 */
export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      // Invalidate expenses list
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}

/**
 * Bulk import expenses mutation
 * @returns {Object} Mutation result
 */
export function useBulkImportExpenses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkImportExpenses,
    onSuccess: () => {
      // Invalidate expenses list after import
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}
