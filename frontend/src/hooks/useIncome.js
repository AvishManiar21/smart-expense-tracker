import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  getIncome,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
} from '../services/income.service';

export function useIncome(filters = {}) {
  return useQuery({
    queryKey: ['income', filters],
    queryFn: () => getIncome(filters),
    staleTime: 30000,
    placeholderData: keepPreviousData, // v5 syntax
  });
}

export function useIncomeById(id) {
  return useQuery({
    queryKey: ['income', id],
    queryFn: () => getIncomeById(id),
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useCreateIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] });
    },
  });
}

export function useUpdateIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateIncome(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['income', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['income'] });
    },
  });
}

export function useDeleteIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] });
    },
  });
}
