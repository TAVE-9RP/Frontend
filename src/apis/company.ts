import memberApi from './member';
import type {
  CompanyRegisterRequest,
  CompanyRegisterResponse,
  CompanySearchResponse,
} from '../types/company';

export const postCompany = async (
  payload: CompanyRegisterRequest,
): Promise<CompanyRegisterResponse> => {
  console.log('=== postCompany 함수 실행 ===');
  const response = await memberApi.post('/companies', payload, {
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
  const response = await memberApi.get('/companies', {
    params: {
      keyword,
    },
    headers: {
      Authorization: '',
    },
  });

  return response.data;
};

export default memberApi;
