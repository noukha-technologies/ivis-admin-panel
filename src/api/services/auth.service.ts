import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';
import { unwrapData } from '../apiResponse';
import type { ApiEnvelope } from '../../types/api.types';
import { clearAuth } from '../../utils/storage';
import { applyAuthSession } from '../../utils/authSession';
import type {
  LoginPayload,
  AuthUser,
  LoginResponse,
} from '../../interfaces/auth.interface';

export type {
  LoginPayload,
  AuthUser,
  LoginResponse,
};

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiEnvelope<LoginResponse>>(
      ENDPOINTS.AUTH.LOGIN,
      payload
    );
    const data = unwrapData(response);
    applyAuthSession(data);
    return data;
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiEnvelope<LoginResponse>>(
      ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    const data = unwrapData(response);
    applyAuthSession(data);
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
