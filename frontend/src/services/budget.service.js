import api from './api';

export async function getBudgets() {
  const response = await api.get('/budgets');
  return response.data;
}

export async function getBudgetStatus() {
  const response = await api.get('/budgets/status');
  return response.data;
}

export async function getBudgetAlerts() {
  const response = await api.get('/budgets/alerts');
  return response.data;
}

export async function createBudget(data) {
  const response = await api.post('/budgets', data);
  return response.data;
}

export async function updateBudget(id, data) {
  const response = await api.put(`/budgets/${id}`, data);
  return response.data;
}

export async function deleteBudget(id) {
  const response = await api.delete(`/budgets/${id}`);
  return response.data;
}

export default {
  getBudgets,
  getBudgetStatus,
  getBudgetAlerts,
  createBudget,
  updateBudget,
  deleteBudget,
};
