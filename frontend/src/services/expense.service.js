import api from './api';

/**
 * Expense service for API calls
 */

/**
 * Get expenses with filters and pagination
 * @param {Object} params - Query parameters for filtering/pagination
 * @returns {Promise<Object>} Expenses data with pagination and summary
 */
export async function getExpenses(params = {}) {
  const response = await api.get('/expenses', { params });
  return response.data;
}

/**
 * Get a single expense by ID
 * @param {string} id - Expense ID
 * @returns {Promise<Object>} Expense data
 */
export async function getExpense(id) {
  const response = await api.get(`/expenses/${id}`);
  return response.data;
}

/**
 * Create a new expense
 * @param {Object} data - Expense data
 * @returns {Promise<Object>} Created expense
 */
export async function createExpense(data) {
  const response = await api.post('/expenses', data);
  return response.data;
}

/**
 * Update an existing expense
 * @param {string} id - Expense ID
 * @param {Object} data - Updated expense data
 * @returns {Promise<Object>} Updated expense
 */
export async function updateExpense(id, data) {
  const response = await api.put(`/expenses/${id}`, data);
  return response.data;
}

/**
 * Delete an expense (soft delete)
 * @param {string} id - Expense ID
 * @returns {Promise<Object>} Success response
 */
export async function deleteExpense(id) {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
}

/**
 * Bulk import expenses from CSV file
 * @param {File} file - CSV file
 * @returns {Promise<Object>} Import results
 */
export async function bulkImportExpenses(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/expenses/bulk', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export default {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  bulkImportExpenses,
};
