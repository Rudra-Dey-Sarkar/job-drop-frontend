export interface CompanyResponse {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyAuthenticationResponse {
  company: CompanyResponse;
  token: string;
}

export interface CompanyListResponse {
  companies: CompanyResponse[];
  limit: number;
  page: number;
  total: number
  totalPages: number;
}
