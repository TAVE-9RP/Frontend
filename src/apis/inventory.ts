import memberApi from './member';

export const getInventoryList = async (keyword: string = '') => {
  const response = await memberApi.get('/inventory', {
    params: { keyword },
  });
  return response.data;
};

export const getInventoryAssignedList = async (keyword: string = '') => {
  const response = await memberApi.get('/inventory/assigned', {
    params: { keyword },
  });
  return response.data;
};

export const getInventoryDetail = async (inventoryId: string | number) => {
  const response = await memberApi.get(`/inventory/${inventoryId}`);
  return response.data;
};

export const addInventoryItems = async (inventoryId: string | number, itemIds: number[]) => {
  const response = await memberApi.post(`/inventory/${inventoryId}/items`, {
    itemIds: itemIds,
  });
  return response.data;
};

export const getInventoryItems = async (inventoryId: string | number) => {
  const response = await memberApi.get(`/inventory/${inventoryId}/items`);
  return response.data;
};

export const requestApproval = async (inventoryId: string | number) => {
  const response = await memberApi.patch(`/inventory/${inventoryId}/request-approval`);
  return response.data;
};

export const updateInventory = async (
  inventoryId: string | number,
  data: { inventoryTitle: string; inventoryDescription: string },
) => {
  const response = await memberApi.patch(`/inventory/${inventoryId}`, data);
  return response.data;
};

export const rejectInventory = async (inventoryId: string | number) => {
  const response = await memberApi.patch(`/admin/inventory/${inventoryId}/reject`);
  return response.data;
};

export const resetInventoryToAssigned = async (inventoryId: string | number) => {
  const response = await memberApi.patch(`/admin/inventory/${inventoryId}/reset-status`);
  return response.data;
};

export const updateInventoryItemTargetQuantity = async (
  inventoryId: string | number,
  updates: { inventoryItemId: number; targetQuantity: number }[],
) => {
  const response = await memberApi.patch(`/inventory/${inventoryId}/items/targetQuantity`, {
    updates: updates,
  });
  return response.data;
};

export const processInventoryItems = async (
  inventoryId: string | number,
  items: { inventoryItemId: number; receiveQuantity: number }[],
) => {
  const response = await memberApi.patch(`/inventory/${inventoryId}/items`, {
    items: items,
  });
  return response.data;
};

export const completeInventory = async (inventoryId: string | number) => {
  const response = await memberApi.patch(`/inventory/${inventoryId}/complete`);
  return response.data;
};

export default memberApi;
