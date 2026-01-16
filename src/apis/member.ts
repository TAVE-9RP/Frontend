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

// 중복 재발급 방지를 위한 변수
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.map((callback) => callback(token));
  refreshSubscribers = [];
};

// interceptor는 토큰이 있을 때만 Authorization 헤더 추가
memberApi.interceptors.request.use((config) => {
  let token = localStorage.getItem('accessToken');

  if (token) {
    const cleanToken = token.replace(/^"(.*)"$/, '$1');
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }

  return config;
});

// AT 재발급
memberApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axios({ ...originalRequest, baseURL: BASE_URL }));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('AccessToken 만료: 토큰 재발급(reissue) 시도...');

        let token = localStorage.getItem('accessToken');
        const cleanToken = token ? token.replace(/^"(.*)"$/, '$1') : '';

        const response = await axios.post(
          `${BASE_URL}/member/reissue`,
          {},
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${cleanToken}`,
            },
          },
        );

        if (response.data.isSuccess) {
          const newAccessToken = response.data.result.accessToken;

          localStorage.setItem('accessToken', newAccessToken);

          onRefreshed(newAccessToken);
          isRefreshing = false;

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };

          console.log('재발급 성공! 원래 요청 재시도 중...');

          return axios({
            ...originalRequest,
            baseURL: BASE_URL,
          });
        }
      } catch (reissueError: any) {
        isRefreshing = false;
        console.error('재발급 과정에서 에러 발생:', reissueError.response?.status);

        if (reissueError.response?.status !== 409) {
          console.error('세션이 만료되었습니다. 다시 로그인해주세요.');
          localStorage.removeItem('accessToken');
        }

        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  },
);

export const postLogin = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await memberApi.post('/member/login', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const postMemberSignup = async (
  payload: MemberSignupRequest,
): Promise<MemberSignupResponse> => {
  const response = await memberApi.post('/member/signup', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

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
