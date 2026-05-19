import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const authService = {
  login: (payload: LoginPayload) =>
    axiosInstance.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, payload),

  logout: () =>
    axiosInstance.post(ENDPOINTS.AUTH.LOGOUT),

  forgotPassword: (email: string) =>
    axiosInstance.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),

  resetPassword: (token: string, password: string) =>
    axiosInstance.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, password }),
};
