import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nexerp.site',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  let token = localStorage.getItem('accessToken');

  if (token) {
    const cleanToken = token.replace(/^"(.*)"$/, '$1');
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }

  return config;
});

export const getInventoryList = async () => {
  const response = await api.get('/inventory');
  return response.data;
};

export const getInventoryDetail = async (inventoryId: string | number) => {
  const response = await api.get(`/inventory/${inventoryId}`);
  return response.data;
};

export const addInventoryItems = async (inventoryId: string | number, itemIds: number[]) => {
  const response = await api.post(`/inventory/${inventoryId}/items`, {
    itemIds: itemIds,
  });
  return response.data;
};

export const getInventoryItems = async (inventoryId: string | number) => {
  const response = await api.get(`/inventory/${inventoryId}/items`);
  return response.data;
};

export default api;

