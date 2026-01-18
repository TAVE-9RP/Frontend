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

memberApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // /member/login 또는 /member/signup 요청에서는 reissue 시도하지 않음
    if (
      originalRequest?.url?.includes('/member/login') ||
      originalRequest?.url?.includes('/member/signup')
    ) {
      return Promise.reject(error);
    }

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
        // catch (reissueError: any) 블록 내부를 다음과 같이 수정하세요
      } catch (reissueError: any) {
        isRefreshing = false;

        // 서버에서 "토큰이 아직 유효하다(409)"고 하면, 에러를 띄우지 말고 다시 시도하게 함
        if (reissueError.response?.status === 409) {
          console.log('토큰이 아직 유효함(409). 원래 요청 다시 시도...');

          // 현재 저장된 토큰을 헤더에 넣어서 다시 시도
          let token = localStorage.getItem('accessToken');
          const cleanToken = token ? token.replace(/^"(.*)"$/, '$1') : '';
          originalRequest.headers.Authorization = `Bearer ${cleanToken}`;

          return axios({
            ...originalRequest,
            baseURL: BASE_URL,
          });
        }

        // 409가 아닌 진짜 에러(401 등)일 때만 토큰 삭제 및 거부
        console.error('세션이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('accessToken');
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
