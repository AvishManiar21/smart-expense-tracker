import api from './api';

/**
 * Category service for API calls
 */

/**
 * Get all categories (system defaults + user custom)
 * @returns {Promise<Object>} Categories data
 */
export async function getCategories() {
  const response = await api.get('/categories');
  return response.data;
}

/**
 * Create a custom category
 * @param {Object} data - Category data (name, icon, color, budgetLimit)
 * @returns {Promise<Object>} Created category
 */
export async function createCategory(data) {
  const response = await api.post('/categories', data);
  return response.data;
}

/**
 * Update a custom category
 * @param {string} id - Category ID
 * @param {Object} data - Updated category data
 * @returns {Promise<Object>} Updated category
 */
export async function updateCategory(id, data) {
  const response = await api.put(`/categories/${id}`, data);
  return response.data;
}

/**
 * Delete a custom category
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Success response
 */
export async function deleteCategory(id) {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
}

export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
