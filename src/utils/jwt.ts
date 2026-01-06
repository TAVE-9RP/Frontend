import { jwtDecode } from 'jwt-decode';

export interface AccessTokenPayload {
  sub: string; // member ID
  companyId: number;
  department: 'MANAGEMENT' | 'LOGISTICS' | 'INVENTORY';
  permissions: {
    inventory: string;
    logistics: string;
    management: string;
  };
  exp: number;
}

export const decodeAccessToken = (token: string): AccessTokenPayload | null => {
  try {
    const decoded = jwtDecode<AccessTokenPayload>(token);
    return decoded;
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
};

export const getDepartmentFromToken = (token: string): 'MANAGEMENT' | 'LOGISTICS' | 'INVENTORY' | null => {
  const payload = decodeAccessToken(token);
  return payload?.department || null;
};

export const getManagementRoleFromToken = (token: string): string | null => {
  const payload = decodeAccessToken(token);
  return payload?.permissions?.management || null;
};

