import axios from 'axios';

import type {
  LoginRequest,
  LoginResponse,
  MemberSignupRequest,
  MemberSignupResponse,
  MemberMeResponse,
} from '../types/member';

const BASE_URL = 'https://nexerp.site';

const memberApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 변수들을 인터셉터 밖 상단에 선언
let isRefreshing = false;
let failedQueue: any[] = []; // 대기열 이름 변경

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

memberApi.interceptors.request.use((config) => {
  const token = localStorage
    .getItem('accessToken')
    ?.replace(/^"(.*)"$/, '$1')
    .trim();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

memberApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return memberApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentToken = localStorage
          .getItem('accessToken')
          ?.replace(/^"(.*)"$/, '$1')
          .trim();

        const { data } = await memberApi.post('/member/reissue', {}, {
          headers: { Authorization: `Bearer ${currentToken}` },
          _retry: true,
        } as any);

        if (data.isSuccess) {
          const newAT = data.result.accessToken.replace(/^"(.*)"$/, '$1').trim();
          localStorage.setItem('accessToken', newAT);

          memberApi.defaults.headers.common['Authorization'] = `Bearer ${newAT}`;
          processQueue(null, newAT);

          originalRequest.headers.Authorization = `Bearer ${newAT}`;
          return memberApi(originalRequest);
        }
      } catch (err: any) {
        if (err.response?.status === 409) {
          const latestToken = localStorage
            .getItem('accessToken')
            ?.replace(/^"(.*)"$/, '$1')
            .trim();
          memberApi.defaults.headers.common['Authorization'] = `Bearer ${latestToken}`;
          processQueue(null, latestToken);
          originalRequest.headers.Authorization = `Bearer ${latestToken}`;
          return memberApi(originalRequest);
        }

        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const postLogin = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await memberApi.post('/member/login', payload);
  return response.data;
};

export const postMemberSignup = async (
  payload: MemberSignupRequest,
): Promise<MemberSignupResponse> => {
  const response = await memberApi.post('/member/signup', payload);
  return response.data;
};

export const getMemberMe = async (): Promise<MemberMeResponse> => {
  const response = await memberApi.get('/member/me');
  return response.data;
};

export const postLogout = async () => {
  const response = await memberApi.post('/member/logout');
  return response.data;
};

export default memberApi;
