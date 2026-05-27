import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBudgets,
  getBudgetStatus,
  getBudgetAlerts,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../services/budget.service';

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: getBudgets,
    staleTime: 60000,
  });
}

export function useBudgetStatus() {
  return useQuery({
    queryKey: ['budgets', 'status'],
    queryFn: getBudgetStatus,
    staleTime: 30000,
  });
}

export function useBudgetAlerts() {
  return useQuery({
    queryKey: ['budgets', 'alerts'],
    queryFn: getBudgetAlerts,
    staleTime: 30000,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateBudget(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}
