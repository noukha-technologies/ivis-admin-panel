/**
 * Route path constants
 * Single source of truth for all route paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  USER_DETAIL: '/users/:id',
  UNAUTHORIZED: '/unauthorized',
} as const;
