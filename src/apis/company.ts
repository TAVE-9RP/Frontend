import axios from 'axios';
import type {
  CompanyRegisterRequest,
  CompanyRegisterResponse,
  CompanySearchResponse,
} from '../types/company';

const BASE_URL = 'https://nexerp.site';

const companyApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// interceptor는 토큰이 있을 때만 Authorization 헤더 추가
companyApi.interceptors.request.use((config) => {
  let token = localStorage.getItem('accessToken');

  if (token) {
    const cleanToken = token.replace(/^"(.*)"$/, '$1');
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }

  return config;
});

export const postCompany = async (payload: CompanyRegisterRequest): Promise<CompanyRegisterResponse> => {
  console.log('=== postCompany 함수 실행 ===');
  console.log('요청 URL:', `${BASE_URL}/companies`);
  console.log('요청 payload:', payload);
  
  const response = await companyApi.post('/companies', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('=== postCompany 응답 ===');
  console.log('응답 status:', response.status);
  console.log('응답 data:', response.data);

  return response.data;
};

export const getCompanies = async (keyword: string = ''): Promise<CompanySearchResponse> => {
  const response = await companyApi.get('/companies', {
    params: {
      keyword,
    },
  });

  return response.data;
};

export default companyApi;

