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
  PAYMENTS: '/transactions/payments',
  VEHICLE_RECORDS: '/transactions/vehicle-records',
  REPORTS: '/reports',
  CUSTOMERS: '/transactions/customers',
  ROP_MANAGEMENT: '/transactions/rop-management',
  JOB_MANAGEMENT: '/job-management',
  MASTER_MANAGEMENT: '/master-management',
  MASTER_VEHICLES: '/master-management/vehicles',
  MASTER_TESTS: '/master-management/tests',
  MASTER_CENTRES: '/master-management/centres',
  MASTER_LINES: '/master-management/lines',
  MASTER_PCS: '/master-management/pcs',
  MASTER_CAMERAS: '/master-management/cameras',
  MASTER_PAYMENTS: '/master-management/payments',
  USERS_MANAGEMENT: '/users-management',
  USERS_ROLES: '/users-management/roles',
  USER_DETAIL: '/users-management/:id',
  CONFIGURATION: '/configuration',
  FILE_PROCESSING: '/transactions/file-processing',
  UNAUTHORIZED: '/unauthorized-access',
} as const;
