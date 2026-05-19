import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';
import type { PaginatedResponse } from '../../types/api.types';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export const userService = {
  getAll: (params?: Record<string, unknown>) =>
    axiosInstance.get<PaginatedResponse<User>>(ENDPOINTS.USERS.BASE, { params }),

  getById: (id: string) =>
    axiosInstance.get<User>(ENDPOINTS.USERS.BY_ID(id)),

  create: (data: Partial<User>) =>
    axiosInstance.post<User>(ENDPOINTS.USERS.BASE, data),

  update: (id: string, data: Partial<User>) =>
    axiosInstance.put<User>(ENDPOINTS.USERS.BY_ID(id), data),

  delete: (id: string) =>
    axiosInstance.delete(ENDPOINTS.USERS.BY_ID(id)),
};
