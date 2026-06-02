import type { ApiCentre } from './centre.interface';

export interface ApiAdminPc {
  id: string;
  admin_pc_id: number;
  name: string;
  code: string;
  ip_address: string;
  centre_id: string;
  centre?: ApiCentre;
  description?: string;
  status: 'Active' | 'Inactive';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAdminPcPayload {
  name: string;
  code: string;
  ip_address: string;
  centre_id: string;
  description?: string;
  status?: 'Active' | 'Inactive';
}

export interface UpdateAdminPcPayload {
  name?: string;
  code?: string;
  ip_address?: string;
  centre_id?: string;
  description?: string;
  status?: 'Active' | 'Inactive';
}

export interface AdminPcListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
