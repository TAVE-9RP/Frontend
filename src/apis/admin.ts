import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nexerp.site',
  // 쿠키와 헤더를 동시에 처리하기 위해 true로 설정
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // 1. 로컬 스토리지에서 토큰을 가져옵니다.
  let token = localStorage.getItem('accessToken');

  if (token) {
    // 2. 혹시 토큰 문자열 앞뒤에 따옴표가 붙어있을 경우를 대비해 제거합니다.
    const cleanToken = token.replace(/^"(.*)"$/, '$1');

    // 3. 팀원분이 요구한 대로 헤더에 직접 주입합니다.
    config.headers.Authorization = `Bearer ${cleanToken}`;

    console.log('보내는 토큰 확인:', config.headers.Authorization);
  } else {
    console.warn('로컬 스토리지에 accessToken이 없습니다!');
  }

  return config;
});

// 나머지 API 함수들
export const getMemberStatuses = () => api.get('/admin/members/statuses');
export const updateMemberStatuses = (updates: any[]) =>
  api.patch('/admin/members/status', { updates });
export const getMemberPermissions = () => api.get('/admin/members/permissions');
export const updateMemberPermissions = (updates: any[]) =>
  api.patch('/admin/members/permissions', { updates });

export default api;
