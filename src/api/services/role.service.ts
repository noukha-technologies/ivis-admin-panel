import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';
import { unwrapData, unwrapPaginated } from '../apiResponse';
import type { ApiEnvelope, PaginatedResult } from '../../types/api.types';

export interface ApiRole {
  id: string;
  role_id: number;
  role_name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  is_deleted?: boolean;
}

export interface CreateRolePayload {
  role_name: string;
  description?: string;
}

export interface UpdateRolePayload {
  role_name?: string;
  description?: string;
}

export interface RoleListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const roleService = {
  getAll: async (params?: RoleListParams): Promise<PaginatedResult<ApiRole>> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiRole[]>>(
      ENDPOINTS.ROLES.BASE,
      { params }
    );
    return unwrapPaginated(response);
  },

  getById: async (id: string): Promise<ApiRole> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiRole>>(
      ENDPOINTS.ROLES.BY_ID(id)
    );
    return unwrapData(response);
  },

  create: async (data: CreateRolePayload): Promise<ApiRole> => {
    const response = await axiosInstance.post<ApiEnvelope<ApiRole>>(
      ENDPOINTS.ROLES.BASE,
      data
    );
    return unwrapData(response);
  },

  update: async (id: string, data: UpdateRolePayload): Promise<ApiRole> => {
    const response = await axiosInstance.patch<ApiEnvelope<ApiRole>>(
      ENDPOINTS.ROLES.BY_ID(id),
      data
    );
    return unwrapData(response);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.ROLES.BY_ID(id));
  },
};
