import axios from 'axios';
import type { LoginRequest, LoginResponse, MemberSignupRequest, MemberSignupResponse } from '../types/member';
import type {
  CompanyRegisterRequest,
  CompanyRegisterResponse,
  CompanySearchResponse,
} from '../types/company';

const BASE_URL = 'https://nexerp.site';

export const postLogin = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post(`${BASE_URL}/member/login`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  return response.data;
};

export const postCompany = async (payload: CompanyRegisterRequest): Promise<CompanyRegisterResponse> => {
  console.log('=== postCompany 함수 실행 ===');
  console.log('요청 URL:', `${BASE_URL}/companies`);
  console.log('요청 payload:', payload);
  
  const response = await axios.post(`${BASE_URL}/companies`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('=== postCompany 응답 ===');
  console.log('응답 status:', response.status);
  console.log('응답 data:', response.data);

  return response.data;
};

export const postMemberSignup = async (payload: MemberSignupRequest): Promise<MemberSignupResponse> => {
  const response = await axios.post(`${BASE_URL}/member/signup`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  return response.data;
};

export const getCompanies = async (keyword: string = ''): Promise<CompanySearchResponse> => {
  const response = await axios.get(`${BASE_URL}/companies`, {
    params: {
      keyword,
    },
  });

  return response.data;
};

