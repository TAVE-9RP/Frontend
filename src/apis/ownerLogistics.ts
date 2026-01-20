import memberApi from './member';

export const getLogisticsList = async (keyword: string = '') => {
  const response = await memberApi.get('/logistics', {
    params: { keyword },
  });
  return response.data;
};

export const getLogisticsDetail = async (logisticsId: string | number) => {
  const response = await memberApi.get(`/logistics/${logisticsId}`);
  return response.data;
};

export const getLogisticsItems = async (logisticsId: string | number) => {
  const response = await memberApi.get(`/logistics/${logisticsId}/items`);
  return response.data;
};

export default memberApi;
