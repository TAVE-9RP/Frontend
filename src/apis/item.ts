import memberApi from './member';

export const getItems = async (keyword: string = '') => {
  const response = await memberApi.get('/items', {
    params: {
      keyword: keyword,
    },
  });
  return response.data;
};

export const createItem = async (data: {
  code: string;
  name: string;
  location: string;
  price: number;
}) => {
  const response = await memberApi.post('/items', data);
  return response.data;
};

export const getItemDetail = async (itemId: string | number) => {
  const response = await memberApi.get(`/items/${itemId}`);
  return response.data;
};

export const getItemHistory = async (itemId: string | number) => {
  const response = await memberApi.get(`/items/${itemId}/history`);
  return response.data;
};

export const updateItemTargetStock = async (itemId: string | number, targetStock: number) => {
  const response = await memberApi.patch(`/items/${itemId}/target-stock`, {
    targetStock: targetStock,
  });
  return response.data;
};

export const updateItemSafetyStock = async (itemId: string | number, safetyStock: number) => {
  const response = await memberApi.patch(`/items/${itemId}/safety-stock`, {
    safetyStock: safetyStock,
  });
  return response.data;
};

export default memberApi;
