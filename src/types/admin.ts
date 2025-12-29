// 공통 응답 구조
export interface BaseResponse<T> {
  timestamp: string;
  isSuccess: boolean;
  status: number;
  code: string;
  message: string;
  result: T;
}

// 1. 가입 상태 관련
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

// 2. 권한 관련
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
