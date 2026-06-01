import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';
import { unwrapData, unwrapPaginated } from '../apiResponse';
import type { ApiEnvelope, PaginatedResult } from '../../types/api.types';
import type {
  ApiRoleAccess,
  CreateRoleAccessPayload,
  UpdateRoleAccessPayload,
  RoleAccessListParams,
} from '../../interfaces/role.interface';

export type {
  ApiRoleAccess,
  CreateRoleAccessPayload,
  UpdateRoleAccessPayload,
  RoleAccessListParams,
};

/** @deprecated Use ApiRoleAccess */
export type ApiRole = ApiRoleAccess;

/** @deprecated Use CreateRoleAccessPayload */
export type CreateRolePayload = CreateRoleAccessPayload;

/** @deprecated Use UpdateRoleAccessPayload */
export type UpdateRolePayload = UpdateRoleAccessPayload;

/** @deprecated Use RoleAccessListParams */
export type RoleListParams = RoleAccessListParams;

export const roleService = {
  getAll: async (params?: RoleAccessListParams): Promise<PaginatedResult<ApiRoleAccess>> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiRoleAccess[]>>(
      ENDPOINTS.PERMISSIONS.BASE,
      { params },
    );
    return unwrapPaginated(response);
  },

  getById: async (id: string): Promise<ApiRoleAccess> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiRoleAccess>>(
      ENDPOINTS.PERMISSIONS.BY_ID(id),
    );
    return unwrapData(response);
  },

  getByName: async (roleName: string): Promise<ApiRoleAccess> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiRoleAccess>>(
      ENDPOINTS.PERMISSIONS.BY_NAME(roleName),
    );
    return unwrapData(response);
  },

  listPermissionKeys: async (): Promise<string[]> => {
    const response = await axiosInstance.get<ApiEnvelope<string[]>>(
      ENDPOINTS.PERMISSIONS.KEYS,
    );
    return unwrapData(response);
  },

  create: async (data: CreateRoleAccessPayload): Promise<ApiRoleAccess> => {
    const response = await axiosInstance.post<ApiEnvelope<ApiRoleAccess>>(
      ENDPOINTS.PERMISSIONS.BASE,
      data,
    );
    return unwrapData(response);
  },

  update: async (id: string, data: UpdateRoleAccessPayload): Promise<ApiRoleAccess> => {
    const response = await axiosInstance.patch<ApiEnvelope<ApiRoleAccess>>(
      ENDPOINTS.PERMISSIONS.BY_ID(id),
      data,
    );
    return unwrapData(response);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.PERMISSIONS.BY_ID(id));
  },
};
