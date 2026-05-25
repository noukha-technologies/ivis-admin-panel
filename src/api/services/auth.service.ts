import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';
import { unwrapData } from '../apiResponse';
import type { ApiEnvelope } from '../../types/api.types';
import type { StoredAuthUser } from '../../utils/storage';
import {
  setToken,
  setRefreshToken,
  setUser,
  setPermissions,
  clearAuth,
} from '../../utils/storage';
import { resolvePermissionsForRole } from '../../constants/rolePermissions';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  user_id: number;
  user_name: string;
  email: string;
  role: string;
  center?: string;
  line?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUser;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiEnvelope<LoginResponse>>(
      ENDPOINTS.AUTH.LOGIN,
      payload
    );
    const data = unwrapData(response);
    setToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user as StoredAuthUser);
    setPermissions(resolvePermissionsForRole(data.user.role));
    return data;
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiEnvelope<LoginResponse>>(
      ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    const data = unwrapData(response);
    setToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user as StoredAuthUser);
    setPermissions(resolvePermissionsForRole(data.user.role));
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post(ENDPOINTS.AUTH.LOGOUT);
    } finally {
      clearAuth();
    }
  },
};
