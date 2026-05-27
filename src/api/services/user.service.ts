import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';
import { unwrapData, unwrapPaginated } from '../apiResponse';
import type { ApiEnvelope, PaginatedResult } from '../../types/api.types';
import type {
  ApiUser,
  CreateUserPayload,
  UpdateUserPayload,
  UserListParams,
} from '../../interfaces/user.interface';

export type {
  ApiUser,
  CreateUserPayload,
  UpdateUserPayload,
  UserListParams,
};

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
