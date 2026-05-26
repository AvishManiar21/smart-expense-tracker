import api from './api';

export async function getIncome(params = {}) {
  const response = await api.get('/income', { params });
  return response.data;
}

export async function getIncomeById(id) {
  const response = await api.get(`/income/${id}`);
  return response.data;
}

export async function createIncome(data) {
  const response = await api.post('/income', data);
  return response.data;
}

export async function updateIncome(id, data) {
  const response = await api.put(`/income/${id}`, data);
  return response.data;
}

export async function deleteIncome(id) {
  const response = await api.delete(`/income/${id}`);
  return response.data;
}

export default {
  getIncome,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
};
