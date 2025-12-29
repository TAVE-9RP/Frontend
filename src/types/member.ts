export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  result: {
    accessToken: string;
  };
}

export interface MemberSignupRequest {
  loginId: string;
  password: string;
  name: string;
  email: string;
  department: 'MANAGEMENT' | 'INVENTORY' | 'LOGISTICS';
  position:
    | 'OWNER'
    | 'DEPARTMENT_HEAD'
    | 'SENIOR_MANAGER'
    | 'MANAGER'
    | 'ASSISTANT_MANAGER'
    | 'INTERN';
  companyId: string;
}

export interface MemberSignupResponse {
  timestamp: string;
  isSuccess: boolean;
  status: number;
  code: string;
  message: string;
  result?: any;
}
