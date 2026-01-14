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

export const getInventoryList = async (keyword: string = '') => {
  const response = await api.get('/inventory', {
    params: { keyword },
  });
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

export const requestApproval = async (inventoryId: string | number) => {
  const response = await api.patch(`/inventory/${inventoryId}/request-approval`);
  return response.data;
};

export const updateInventory = async (
  inventoryId: string | number,
  data: { inventoryTitle: string; inventoryDescription: string },
) => {
  const response = await api.patch(`/inventory/${inventoryId}`, data);
  return response.data;
};

export const rejectInventory = async (inventoryId: string | number) => {
  const response = await api.patch(`/admin/inventory/${inventoryId}/reject`);
  return response.data;
};

export const updateInventoryItemTargetQuantity = async (
  inventoryId: string | number,
  updates: { inventoryItemId: number; targetQuantity: number }[],
) => {
  const response = await api.patch(`/inventory/${inventoryId}/items/targetQuantity`, {
    updates: updates,
  });
  return response.data;
};

export const processInventoryItems = async (
  inventoryId: string | number,
  items: { inventoryItemId: number; receiveQuantity: number }[],
) => {
  const response = await api.patch(`/inventory/${inventoryId}/items`, {
    items: items,
  });
  return response.data;
};

export const completeInventory = async (inventoryId: string | number) => {
  const response = await api.patch(`/inventory/${inventoryId}/complete`);
  return response.data;
};

export default api;

