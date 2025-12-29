export interface BaseResponse<T> {
  timestamp: string;
  isSuccess: boolean;
  status: number;
  code: string;
  message: string;
  result: T;
}

export interface MemberStatus {
  memberId: number;
  name: string;
  department: string;
  position: string;
  email: string;
  requestStatus: 'PENDING' | 'APPROVE' | 'REJECT';
}

export interface UpdateStatusRequest {
  updates: {
    memberId: number;
    newStatus: string;
  }[];
}

export interface MemberPermission {
  memberId: number;
  name: string;
  department: string;
  position: string;
  currentRole: 'ALL' | 'ADMIN' | 'INVENTORY' | 'LOGISTICS';
}

export interface UpdatePermissionRequest {
  updates: {
    memberId: number;
    newRole: string;
  }[];
}
