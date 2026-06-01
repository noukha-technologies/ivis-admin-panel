import type { RoleAccessMatrix } from '../constants/roleAccessMatrix';

export interface ApiRoleAccess {
  id: string;
  role_name: string;
  access: RoleAccessMatrix;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRoleAccessPayload {
  role_name: string;
  access: RoleAccessMatrix;
  created_by?: string;
}

export interface UpdateRoleAccessPayload {
  role_name?: string;
  access?: RoleAccessMatrix;
  created_by?: string;
}

export interface RoleAccessListParams {
  page?: number;
  limit?: number;
  search?: string;
}
