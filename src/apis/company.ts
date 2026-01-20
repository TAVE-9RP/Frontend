import axios from 'axios';
import memberApi from './member';

const BASE_URL = 'https://nexerp.site';

import type {
  CompanyRegisterRequest,
  CompanyRegisterResponse,
  CompanySearchResponse,
} from '../types/company';

// memberApi가 아닌 일반 axios 인스턴스 사용
export const postCompany = async (
  payload: CompanyRegisterRequest,
): Promise<CompanyRegisterResponse> => {
  const response = await axios.post(`${BASE_URL}/companies`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// memberApi 대신 axios 사용
export const getCompanies = async (keyword: string = ''): Promise<CompanySearchResponse> => {
  const response = await axios.get(`${BASE_URL}/companies`, {
    params: { keyword },
  });
  return response.data;
};

export const uploadCompanyLogo = async (companyId: number, imageFile: File) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await axios.post(`${BASE_URL}/companies/${companyId}/logo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default memberApi;
