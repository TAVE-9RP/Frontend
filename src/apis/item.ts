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

export const getItems = async (keyword: string = '') => {
  const response = await api.get('/items', {
    params: {
      keyword: keyword,
    },
  });
  return response.data;
};

export default api;

