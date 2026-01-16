export interface TestValidationRequest {
  name: string;
  age: number;
}

export interface TestValidationResponse {
  timestamp: string;
  isSuccess: boolean;
  status: number;
  code: string;
  message: string;
  result: string;
}

export interface TestGetResponse {
  timestamp: string;
  isSuccess: boolean;
  status: number;
  code: string;
  message: string;
  result: string;
}

export interface TestUnexpectedErrorResponse {
  timestamp: string;
  isSuccess: boolean;
  status: number;
  code: string;
  message: string;
  result: Record<string, unknown>;
}

export type TestSystemErrorResponse = string;

export type TestErrorResponse = {
  timestamp: string;
  isSuccess: boolean;
  status: number;
  code: string;
  message: string;
  result: Record<string, unknown>;
}

export interface TestCustomErrorResponse {
  timestamp: string;
  isSuccess: boolean;
  status: number;
  code: string;
  message: string;
  result: number;
}
