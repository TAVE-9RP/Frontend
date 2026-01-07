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

export const getLogisticsList = async () => {
  const response = await api.get('/logistics');
  return response.data;
};

export const getLogisticsDetail = async (logisticsId: string | number) => {
  const response = await api.get(`/logistics/${logisticsId}`);
  return response.data;
};

export default api;

