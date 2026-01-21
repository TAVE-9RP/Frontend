import memberApi from './member';
import type {
  LogisticsSummary,
  LogisticsDetail,
  ApiResponse,
  UpdateLogisticsCommonRequest,
  ProcessOutboundRequest,
  AddOutboundItemsRequest,
} from '@/types/logistics';

export const getLogisticsList = async (
  keyword: string = '',
): Promise<ApiResponse<LogisticsSummary[]>> => {
  const response = await memberApi.get('/logistics', {
    params: {
      keyword: keyword,
    },
  });
  return response.data;
};

export const getLogisticsDetail = async (
  logisticsId: number,
): Promise<ApiResponse<LogisticsDetail>> => {
  const response = await memberApi.get(`/logistics/${logisticsId}`);
  return response.data;
};

export const getLogisticsItems = async (logisticsId: number) => {
  const response = await memberApi.get(`/logistics/${logisticsId}/items`);
  return response.data;
};

export const postLogisticsItems = async (
  logisticsId: number,
  payload: AddOutboundItemsRequest,
): Promise<ApiResponse<any>> => {
  const response = await memberApi.post(`/logistics/${logisticsId}/items`, payload);
  return response.data;
};

export const patchLogisticsItems = async (
  logisticsId: number,
  payload: ProcessOutboundRequest,
): Promise<ApiResponse<any>> => {
  const response = await memberApi.patch(`/logistics/${logisticsId}/items`, payload);
  return response.data;
};

export const patchUpdateLogisticsCommon = async (
  logisticsId: number,
  data: UpdateLogisticsCommonRequest,
): Promise<ApiResponse<LogisticsDetail>> => {
  const response = await memberApi.patch(`/logistics/${logisticsId}`, data);
  return response.data;
};

export const patchRequestApproval = async (logisticsId: number): Promise<ApiResponse<any>> => {
  const response = await memberApi.patch(`/logistics/${logisticsId}/request-approval`);
  return response.data;
};

export const patchCompleteLogistics = async (logisticsId: number): Promise<ApiResponse<any>> => {
  const response = await memberApi.patch(`/logistics/${logisticsId}/complete`);
  return response.data;
};

export const getMyAssignedLogistics = async (keyword: string) => {
  const response = await memberApi.get('/logistics/assigned', {
    params: { keyword },
  });
  return response.data;
};

export const getInventoryItems = async () => {
  const response = await memberApi.get('/items');
  return response.data;
};

export const patchTargetQuantity = async (
  logisticsId: number,
  items: { logisticsItemId: number; targetQuantity: number }[],
) => {
  const response = await memberApi.patch(`/logistics/${logisticsId}/items/targetQuantity`, {
    items,
  });
  return response.data;
};

export const getItemDetail = async (itemId: number): Promise<ApiResponse<any>> => {
  const response = await memberApi.get(`/items/${itemId}`);
  return response.data;
};

export default memberApi;
