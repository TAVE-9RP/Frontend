import memberApi from './member';

export const getMemberStatuses = () => memberApi.get('/admin/members/statuses');
export const updateMemberStatuses = (updates: any[]) =>
  memberApi.patch('/admin/members/status', { updates });
export const getMemberPermissions = () => memberApi.get('/admin/members/permissions');
export const updateMemberPermissions = (updates: any[]) =>
  memberApi.patch('/admin/members/permissions', { updates });

export const getProjects = async (keyword: string = '') => {
  // GET 요청, keyword는 query parameter (빈 값이면 파라미터 자체를 보내지 않음)
  const response = await memberApi.get('/projects', {
    params: {
      keyword: keyword,
    },
  });
  return response.data;
};

export const getProjectDetail = async (projectId: number) => {
  const response = await memberApi.get(`/projects/${projectId}`);
  return response.data;
};

export const getProjectSerialNumber = async () => {
  const response = await memberApi.get('/projects/serial-num');
  return response.data;
};

export const getAssignedProjects = async () => {
  const response = await memberApi.get('/projects/assigned');
  return response.data;
};

export const getAssignMembers = async () => {
  const response = await memberApi.get('/projects/assign-members');
  return response.data;
};

export interface CreateProjectRequest {
  projectNumber: string;
  projectName: string;
  projectDescription: string;
  projectTaskDescription: string;
  projectCustomer: string;
  projectExpectedEndDate: string;
  assigneeIds: number[];
}

export const createProject = async (data: CreateProjectRequest) => {
  const response = await memberApi.post('/projects', data);
  return response.data;
};

export const approveInventory = async (inventoryId: string | number) => {
  const response = await memberApi.patch(`/admin/inventory/${inventoryId}/approve`);
  return response.data;
};

export const approveLogistics = async (logisticsId: string | number) => {
  const response = await memberApi.patch(`/admin/logistics/${logisticsId}/approve`);
  return response.data;
};

export const rejectLogistics = async (logisticsId: string | number) => {
  const response = await memberApi.patch(`/admin/logistics/${logisticsId}/reject`);
  return response.data;
};

export default memberApi;
