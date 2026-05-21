/**
 * Route path constants
 * Single source of truth for all route paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  APPOINTMENTS: '/appointments',
  PAYMENTS: '/payments',
  VEHICLE_RECORDS: '/vehicle-records',
  CUSTOMERS: '/customers',
  ROP_MANAGEMENT: '/rop-management',
  JOB_MANAGEMENT: '/job-management',
  USERS: '/users',
  USER_DETAIL: '/users/:id',
  UNAUTHORIZED: '/unauthorized',
} as const;
