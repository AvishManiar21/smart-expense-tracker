import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  getSummary,
  getTrends,
  getCategoryBreakdown,
  getInsights,
  getComparison,
  getIncomeVsExpense,
} from '../services/analytics.service';

/**
 * Fetch monthly summary
 * @param {string} month - Month in YYYY-MM format
 * @returns {Object} Query result with summary data
 */
export function useSummary(month) {
  return useQuery({
    queryKey: ['analytics', 'summary', month],
    queryFn: () => getSummary(month),
    staleTime: 60000, // 1 minute
    placeholderData: keepPreviousData,
  });
}

/**
 * Fetch spending trends
 * @param {string} period - 3months, 6months, or 12months
 * @returns {Object} Query result with trends data
 */
export function useTrends(period = '6months') {
  return useQuery({
    queryKey: ['analytics', 'trends', period],
    queryFn: () => getTrends(period),
    staleTime: 60000,
    placeholderData: keepPreviousData,
  });
}

/**
 * Fetch category breakdown
 * @param {string} month - Month in YYYY-MM format
 * @returns {Object} Query result with category data
 */
export function useCategoryBreakdown(month) {
  return useQuery({
    queryKey: ['analytics', 'category-breakdown', month],
    queryFn: () => getCategoryBreakdown(month),
    staleTime: 60000,
    placeholderData: keepPreviousData,
  });
}

/**
 * Fetch AI-powered insights
 * @param {string} month - Month in YYYY-MM format
 * @returns {Object} Query result with insights
 */
export function useInsights(month) {
  return useQuery({
    queryKey: ['analytics', 'insights', month],
    queryFn: () => getInsights(month),
    staleTime: 30000, // 30 seconds (fresher for insights)
  });
}

/**
 * Fetch month-over-month comparison
 * @param {string} month - Month in YYYY-MM format
 * @returns {Object} Query result with comparison data
 */
export function useComparison(month) {
  return useQuery({
    queryKey: ['analytics', 'comparison', month],
    queryFn: () => getComparison(month),
    staleTime: 60000,
    placeholderData: keepPreviousData,
  });
}

/**
 * Fetch income vs expense for last 12 months
 * @returns {Object} Query result with income vs expense data
 */
export function useIncomeVsExpense() {
  return useQuery({
    queryKey: ['analytics', 'income-vs-expense'],
    queryFn: getIncomeVsExpense,
    staleTime: 300000, // 5 minutes
  });
}
