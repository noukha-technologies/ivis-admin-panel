import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';
import { unwrapData, unwrapPaginated } from '../apiResponse';
import type { ApiEnvelope, PaginatedResult } from '../../types/api.types';

export interface ApiUser {
  id: string;
  user_id: number;
  user_name: string;
  email: string;
  role: string;
  center?: string;
  line?: string;
  created_at: string;
  updated_at?: string;
  is_deleted?: boolean;
}

export interface CreateUserPayload {
  user_id: number;
  user_name: string;
  email: string;
  role_id: number;
  password?: string;
  center?: string;
  line?: string;
}

export interface UpdateUserPayload {
  user_name?: string;
  email?: string;
  role_id?: number;
  center?: string;
  line?: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const userService = {
  getAll: async (params?: UserListParams): Promise<PaginatedResult<ApiUser>> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiUser[]>>(ENDPOINTS.USERS.BASE, {
      params,
    });
    return unwrapPaginated(response);
  },

  getById: async (id: string): Promise<ApiUser> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiUser>>(
      ENDPOINTS.USERS.BY_ID(id)
    );
    return unwrapData(response);
  },

  create: async (data: CreateUserPayload): Promise<ApiUser> => {
    const response = await axiosInstance.post<ApiEnvelope<ApiUser>>(
      ENDPOINTS.USERS.BASE,
      data
    );
    return unwrapData(response);
  },

  update: async (id: string, data: UpdateUserPayload): Promise<ApiUser> => {
    const response = await axiosInstance.patch<ApiEnvelope<ApiUser>>(
      ENDPOINTS.USERS.BY_ID(id),
      data
    );
    return unwrapData(response);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.USERS.BY_ID(id));
  },
};
