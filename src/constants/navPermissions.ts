import { PERMISSIONS, type Permission } from './permissions';
import { ROUTES } from '../router/routes';

export type NavPermissionEntry = {
  permissions: Permission[];
  match?: 'any' | 'all';
};

export const MENU_PERMISSIONS: Record<string, NavPermissionEntry> = {
  Dashboard: { permissions: [PERMISSIONS.DASHBOARD_VIEW] },
  Appointments: { permissions: [PERMISSIONS.APPOINTMENTS_VIEW] },
  'Job Management': { permissions: [PERMISSIONS.JOBS_VIEW] },
  'Reports & Analytics': { permissions: [PERMISSIONS.REPORTS_VIEW] },
  'Master Management': { permissions: [PERMISSIONS.MASTERS_VIEW] },
  Transactions: {
    permissions: [
      PERMISSIONS.PAYMENTS_VIEW,
      PERMISSIONS.VEHICLE_RECORDS_VIEW,
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.FILE_PROCESSING_VIEW,
      PERMISSIONS.ROP_VIEW,
    ],
  },
  Payments: { permissions: [PERMISSIONS.PAYMENTS_VIEW] },
  'Vehicle Records': { permissions: [PERMISSIONS.VEHICLE_RECORDS_VIEW] },
  Customers: { permissions: [PERMISSIONS.CUSTOMERS_VIEW] },
  'File Processing': { permissions: [PERMISSIONS.FILE_PROCESSING_VIEW] },
  'ROP Management': { permissions: [PERMISSIONS.ROP_VIEW] },
  'User Management': {
    permissions: [PERMISSIONS.USER_VIEW, PERMISSIONS.PERMISSIONS_VIEW],
  },
  Users: { permissions: [PERMISSIONS.USER_VIEW] },
  Roles: { permissions: [PERMISSIONS.PERMISSIONS_VIEW] },
  Configuration: { permissions: [PERMISSIONS.CONFIGURATION_VIEW] },
  Vehicle: { permissions: [PERMISSIONS.MASTERS_VIEW] },
  'Manual Test': { permissions: [PERMISSIONS.MASTERS_VIEW] },
  Centre: { permissions: [PERMISSIONS.MASTERS_VIEW] },
  Line: { permissions: [PERMISSIONS.MASTERS_VIEW] },
  'Admin PC': { permissions: [PERMISSIONS.MASTERS_VIEW] },
  'Camera / ANPR': { permissions: [PERMISSIONS.MASTERS_VIEW] },
  'Centre Setup': { permissions: [PERMISSIONS.CONFIGURATION_VIEW] },
  Charges: { permissions: [PERMISSIONS.CONFIGURATION_VIEW] },
  'Manual Tests': { permissions: [PERMISSIONS.CONFIGURATION_VIEW] },
  ANPR: { permissions: [PERMISSIONS.CONFIGURATION_VIEW] },
};

export const ROUTE_PERMISSIONS: Record<string, NavPermissionEntry> = {
  [ROUTES.DASHBOARD]: MENU_PERMISSIONS.Dashboard,
  [ROUTES.APPOINTMENTS]: MENU_PERMISSIONS.Appointments,
  [ROUTES.JOB_MANAGEMENT]: MENU_PERMISSIONS['Job Management'],
  [ROUTES.REPORTS]: MENU_PERMISSIONS['Reports & Analytics'],
  [ROUTES.MASTER_MANAGEMENT]: MENU_PERMISSIONS['Master Management'],
  [ROUTES.MASTER_VEHICLES]: MENU_PERMISSIONS.Vehicle,
  [ROUTES.MASTER_TESTS]: MENU_PERMISSIONS['Manual Test'],
  [ROUTES.MASTER_CENTRES]: MENU_PERMISSIONS.Centre,
  [ROUTES.MASTER_LINES]: MENU_PERMISSIONS.Line,
  [ROUTES.MASTER_PCS]: MENU_PERMISSIONS['Admin PC'],
  [ROUTES.MASTER_CAMERAS]: MENU_PERMISSIONS['Camera / ANPR'],
  [ROUTES.MASTER_PAYMENTS]: MENU_PERMISSIONS.Payments,
  [ROUTES.PAYMENTS]: MENU_PERMISSIONS.Payments,
  [ROUTES.VEHICLE_RECORDS]: MENU_PERMISSIONS['Vehicle Records'],
  [ROUTES.CUSTOMERS]: MENU_PERMISSIONS.Customers,
  [ROUTES.FILE_PROCESSING]: MENU_PERMISSIONS['File Processing'],
  [ROUTES.ROP_MANAGEMENT]: MENU_PERMISSIONS['ROP Management'],
  [ROUTES.USERS_MANAGEMENT]: MENU_PERMISSIONS.Users,
  [ROUTES.USERS_ROLES]: MENU_PERMISSIONS.Roles,
  [ROUTES.CONFIGURATION]: MENU_PERMISSIONS.Configuration,
};

/** Priority order for post-login landing when user lacks dashboard access */
export const LANDING_ROUTE_PRIORITY: string[] = [
  ROUTES.DASHBOARD,
  ROUTES.APPOINTMENTS,
  ROUTES.JOB_MANAGEMENT,
  ROUTES.PAYMENTS,
  ROUTES.VEHICLE_RECORDS,
  ROUTES.CUSTOMERS,
  ROUTES.ROP_MANAGEMENT,
  ROUTES.FILE_PROCESSING,
  ROUTES.REPORTS,
  ROUTES.MASTER_MANAGEMENT,
  ROUTES.USERS_MANAGEMENT,
  ROUTES.CONFIGURATION,
];

export function canAccessNavEntry(
  entry: NavPermissionEntry | undefined,
  hasAny: (permissions: Permission[]) => boolean,
  hasAll: (permissions: Permission[]) => boolean,
): boolean {
  if (!entry) {
    return true;
  }
  if (entry.match === 'all') {
    return hasAll(entry.permissions);
  }
  return hasAny(entry.permissions);
}

export function getDefaultLandingRoute(
  hasAny: (permissions: Permission[]) => boolean,
  hasAll: (permissions: Permission[]) => boolean,
): string {
  for (const route of LANDING_ROUTE_PRIORITY) {
    const entry = ROUTE_PERMISSIONS[route];
    if (canAccessNavEntry(entry, hasAny, hasAll)) {
      return route;
    }
  }
  return ROUTES.UNAUTHORIZED;
}
