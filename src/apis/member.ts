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

// interceptor는 토큰이 있을 때만 Authorization 헤더 추가
memberApi.interceptors.request.use((config) => {
  let token = localStorage.getItem('accessToken');

  if (token) {
    const cleanToken = token.replace(/^"(.*)"$/, '$1');
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }

  return config;
});

export const postLogin = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await memberApi.post('/member/login', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const postMemberSignup = async (payload: MemberSignupRequest): Promise<MemberSignupResponse> => {
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

export default memberApi;

