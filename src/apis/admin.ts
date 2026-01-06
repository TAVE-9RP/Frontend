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

    console.log('보내는 토큰 확인:', config.headers.Authorization);
  } else {
    console.warn('로컬 스토리지에 accessToken이 없습니다!');
  }

  return config;
});

export const getMemberStatuses = () => api.get('/admin/members/statuses');
export const updateMemberStatuses = (updates: any[]) =>
  api.patch('/admin/members/status', { updates });
export const getMemberPermissions = () => api.get('/admin/members/permissions');
export const updateMemberPermissions = (updates: any[]) =>
  api.patch('/admin/members/permissions', { updates });

export const getProjects = async (keyword: string = '') => {
  // GET 요청, keyword는 query parameter (빈 값이면 파라미터 자체를 보내지 않음)
  const response = await api.get('/projects', {
    params: { 
      keyword: keyword 
    },
  });
  return response.data;
};

export const getProjectDetail = async (projectId: number) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

export default api;
