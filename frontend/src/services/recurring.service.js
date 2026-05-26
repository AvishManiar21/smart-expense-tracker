import api from './api';

export async function getRecurring() {
  const response = await api.get('/recurring');
  return response.data;
}

export async function createRecurring(data) {
  const response = await api.post('/recurring', data);
  return response.data;
}

export async function updateRecurring(id, data) {
  const response = await api.put(`/recurring/${id}`, data);
  return response.data;
}

export async function deleteRecurring(id) {
  const response = await api.delete(`/recurring/${id}`);
  return response.data;
}

export async function processRecurring() {
  const response = await api.post('/recurring/process');
  return response.data;
}

export default {
  getRecurring,
  createRecurring,
  updateRecurring,
  deleteRecurring,
  processRecurring,
};
