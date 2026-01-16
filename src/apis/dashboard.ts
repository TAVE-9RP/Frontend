import memberApi from './member';

export const getDashboard = async () => {
  const response = await memberApi.get('/kpi/dashboard');
  return response.data;
};

export const getShipmentLeadTimeChart = async () => {
  const response = await memberApi.get('/kpi/chart/shipment-lead-time');
  return response.data;
};

export default memberApi;
