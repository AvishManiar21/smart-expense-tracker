import api from './api';

/**
 * Analytics Service
 * API calls for analytics and insights
 */

/**
 * Get monthly summary with key metrics
 * @param {string} month - Month in YYYY-MM format
 * @returns {Promise<Object>} Summary data
 */
export const getSummary = (month) => {
  const params = month ? { month } : {};
  return api.get('/analytics/summary', { params });
};

/**
 * Get spending trends over time
 * @param {string} period - 3months, 6months, or 12months
 * @returns {Promise<Array>} Trends data
 */
export const getTrends = (period = '6months') => {
  return api.get('/analytics/trends', { params: { period } });
};

/**
 * Get category breakdown for a month
 * @param {string} month - Month in YYYY-MM format
 * @returns {Promise<Array>} Category breakdown
 */
export const getCategoryBreakdown = (month) => {
  const params = month ? { month } : {};
  return api.get('/analytics/category-breakdown', { params });
};

/**
 * Get AI-powered insights
 * @param {string} month - Month in YYYY-MM format
 * @returns {Promise<Array>} Array of insights
 */
export const getInsights = (month) => {
  const params = month ? { month } : {};
  return api.get('/analytics/insights', { params });
};

/**
 * Get month-over-month comparison
 * @param {string} month - Month in YYYY-MM format
 * @returns {Promise<Object>} Comparison data
 */
export const getComparison = (month) => {
  const params = month ? { month } : {};
  return api.get('/analytics/comparison', { params });
};

/**
 * Get income vs expense for last 12 months
 * @returns {Promise<Array>} Income vs expense data
 */
export const getIncomeVsExpense = () => {
  return api.get('/analytics/income-vs-expense');
};
