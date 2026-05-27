/**
 * API endpoint constants
 * Centralized endpoint definitions for all API calls
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  ROLES: {
    BASE: '/masters/roles',
    BY_ID: (id: string) => `/masters/roles/${id}`,
  },
  VEHICLES: {
    BASE: '/masters/vehicles',
    BY_ID: (id: string) => `/masters/vehicles/${id}`,
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    REVENUE: '/dashboard/revenue',
  },
} as const;
