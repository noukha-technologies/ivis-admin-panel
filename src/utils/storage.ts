/**
 * localStorage helper utilities
 */
import type { Permission } from '../constants/permissions';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';
const PERMISSIONS_KEY = 'auth_permissions';

export interface StoredAuthUser {
  id: string;
  user_id: number;
  user_code?: string;
  user_name: string;
  email: string;
  role: string;
  role_access_id?: string;
  center?: string;
  line?: string;
  center_id?: string;
  line_ids?: string[];
}

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const removeRefreshToken = (): void => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getUser = (): StoredAuthUser | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user: StoredAuthUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

export const getPermissions = (): Permission[] => {
  const raw = localStorage.getItem(PERMISSIONS_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const setPermissions = (permissions: Permission[]): void => {
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
};

export const removePermissions = (): void => {
  localStorage.removeItem(PERMISSIONS_KEY);
};

export const clearAuth = (): void => {
  removeToken();
  removeRefreshToken();
  removeUser();
  removePermissions();
  window.dispatchEvent(new Event('ivis-auth-session-updated'));
};
