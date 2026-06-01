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
  /** Role access matrix (core.role_access) — replaces legacy masters/roles */
  PERMISSIONS: {
    BASE: '/permissions',
    KEYS: '/permissions/keys',
    BY_ID: (id: string) => `/permissions/${id}`,
    BY_NAME: (roleName: string) => `/permissions/by-name/${encodeURIComponent(roleName)}`,
  },
  VEHICLES: {
    BASE: '/masters/vehicles',
    BY_ID: (id: string) => `/masters/vehicles/${id}`,
  },
  TESTS: {
    BASE: '/masters/tests',
    BY_ID: (id: string) => `/masters/tests/${id}`,
  },
  CENTRES: {
    BASE: '/masters/centres',
    BY_ID: (id: string) => `/masters/centres/${id}`,
  },
  LINES: {
    BASE: '/masters/lines',
    BY_ID: (id: string) => `/masters/lines/${id}`,
  },
  ADMIN_PCS: {
    BASE: '/masters/admin-pcs',
    BY_ID: (id: string) => `/masters/admin-pcs/${id}`,
  },
  CAMERAS: {
    BASE: '/masters/cameras',
    BY_ID: (id: string) => `/masters/cameras/${id}`,
  },
  PAYMENTS: {
    BASE: '/masters/payments',
    BY_ID: (id: string) => `/masters/payments/${id}`,
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    REVENUE: '/dashboard/revenue',
  },
  ANPR_CAPTURES: {
    BASE: '/transactions/anpr-captures',
    BY_ID: (id: string) => `/transactions/anpr-captures/${id}`,
  },
  ROP_VERIFICATIONS: {
    BASE: '/transactions/rop-verifications',
    BY_ID: (id: string) => `/transactions/rop-verifications/${id}`,
  },
  CUSTOMERS: {
    BASE: '/transactions/customers',
    BY_ID: (id: string) => `/transactions/customers/${id}`,
  },
  APPOINTMENTS: {
    BASE: '/appointments',
    BY_ID: (id: string) => `/appointments/${id}`,
  },
  PAYMENT_TRANSACTIONS: {
    BASE: '/transactions/payment-transactions',
    BY_ID: (id: string) => `/transactions/payment-transactions/${id}`,
  },
  JOBS: {
    BASE: '/jobs',
    BY_ID: (id: string) => `/jobs/${id}`,
  },
} as const;
