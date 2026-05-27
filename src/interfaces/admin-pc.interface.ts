import type { ApiLine } from './line.interface';

export interface ApiAdminPc {
  id: string;
  admin_pc_id: number;
  name: string;
  code: string;
  ip_address: string;
  line_id: string;
  line?: ApiLine;
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
  line_id: string;
  description?: string;
  status?: 'Active' | 'Inactive';
}

export interface UpdateAdminPcPayload {
  name?: string;
  code?: string;
  ip_address?: string;
  line_id?: string;
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
