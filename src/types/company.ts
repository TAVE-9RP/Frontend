export interface CompanyRegisterRequest {
  name: string;
  industryType: string;
  description: string;
  imagePath: string;
}

export interface CompanyRegisterResponse {
  timestamp: string;
  isSuccess: boolean;
  status: number;
  code: string;
  message: string;
  result: {
    companyId: number;
  };
}

export interface Company {
  id: number;
  name: string;
  industryType?: string;
  description?: string;
  imagePath?: string;
}

export interface CompanySearchResponse {
  timestamp: string;
  isSuccess: boolean;
  status: number;
  code: string;
  message: string;
  result: Company[];
}

