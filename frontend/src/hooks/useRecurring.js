import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRecurring,
  createRecurring,
  updateRecurring,
  deleteRecurring,
  processRecurring,
} from '../services/recurring.service';

export function useRecurring() {
  return useQuery({
    queryKey: ['recurring'],
    queryFn: getRecurring,
    staleTime: 60000,
  });
}

export function useCreateRecurring() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRecurring,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
    },
  });
}

export function useUpdateRecurring() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateRecurring(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
    },
  });
}

export function useDeleteRecurring() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecurring,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
    },
  });
}

export function useProcessRecurring() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: processRecurring,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}
