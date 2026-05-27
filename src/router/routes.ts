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
  MASTER_MANAGEMENT: '/master-management',
  MASTER_VEHICLES: '/master-management/vehicles',
  MASTER_TESTS: '/master-management/tests',
  MASTER_CENTRES: '/master-management/centres',
  MASTER_LINES: '/master-management/lines',
  MASTER_PCS: '/master-management/pcs',
  MASTER_CAMERAS: '/master-management/cameras',
  USERS: '/users',
  USER_DETAIL: '/users/:id',
  CONFIGURATION: '/configuration',
  FILE_PROCESSING: '/file-processing',
  UNAUTHORIZED: '/unauthorized',
} as const;
