import axios from 'axios';
import type {
  LogisticsSummary,
  LogisticsDetail,
  ApiResponse,
  UpdateLogisticsCommonRequest,
  ProcessOutboundRequest,
  AddOutboundItemsRequest,
} from '@/types/logistics';

const BASE_URL = 'https://nexerp.site';

const logisticsApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

logisticsApi.interceptors.request.use((config) => {
  let token = localStorage.getItem('accessToken');
  if (token) {
    const cleanToken = token.replace(/^"(.*)"$/, '$1');
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }
  return config;
});

export const getLogisticsList = async (
  keyword: string = '',
): Promise<ApiResponse<LogisticsSummary[]>> => {
  const response = await logisticsApi.get('/logistics', {
    params: {
      keyword: keyword,
    },
  });
  return response.data;
};

export const getLogisticsDetail = async (
  logisticsId: number,
): Promise<ApiResponse<LogisticsDetail>> => {
  const response = await logisticsApi.get(`/logistics/${logisticsId}`);
  return response.data;
};

export const getLogisticsItems = async (logisticsId: number) => {
  const response = await logisticsApi.get(`/logistics/${logisticsId}/items`);
  return response.data;
};

export const postLogisticsItems = async (
  logisticsId: number,
  payload: AddOutboundItemsRequest,
): Promise<ApiResponse<any>> => {
  const response = await logisticsApi.post(`/logistics/${logisticsId}/items`, payload);
  return response.data;
};

export const patchLogisticsItems = async (
  logisticsId: number,
  payload: ProcessOutboundRequest,
): Promise<ApiResponse<any>> => {
  const response = await logisticsApi.patch(`/logistics/${logisticsId}/items`, payload);
  return response.data;
};

export const patchUpdateLogisticsCommon = async (
  logisticsId: number,
  data: UpdateLogisticsCommonRequest,
): Promise<ApiResponse<LogisticsDetail>> => {
  const response = await logisticsApi.patch(`/logistics/${logisticsId}`, data);
  return response.data;
};

export const patchRequestApproval = async (logisticsId: number): Promise<ApiResponse<any>> => {
  const response = await logisticsApi.patch(`/logistics/${logisticsId}/request-approval`);
  return response.data;
};

export const patchCompleteLogistics = async (logisticsId: number): Promise<ApiResponse<any>> => {
  const response = await logisticsApi.patch(`/logistics/${logisticsId}/complete`);
  return response.data;
};

export const getMyAssignedLogistics = async (keyword: string) => {
  const response = await logisticsApi.get('/logistics/assigned', {
    params: { keyword },
  });
  return response.data;
};

export const getInventoryItems = async () => {
  const response = await logisticsApi.get('/items');
  return response.data;
};

export const patchTargetQuantity = async (
  logisticsId: number,
  items: { logisticsItemId: number; targetQuantity: number }[],
) => {
  const response = await logisticsApi.patch(`/logistics/${logisticsId}/items/targetQuantity`, {
    items,
  });
  return response.data;
};

export default logisticsApi;
