import { PERMISSIONS, type Permission } from './permissions';

const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);

const FULL_ACCESS_ROLES = new Set([
  'admin',
  'super admin',
  'super_admin',
  'system admin',
]);

const RECEPTIONIST_PERMISSIONS: Permission[] = [
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.APPOINTMENTS_CREATE,
  PERMISSIONS.APPOINTMENTS_VIEW,
  PERMISSIONS.APPOINTMENTS_UPSERT,
  PERMISSIONS.PAYMENTS_CREATE,
  PERMISSIONS.PAYMENTS_VIEW,
  PERMISSIONS.PAYMENTS_UPSERT,
  PERMISSIONS.ANPR_CREATE,
  PERMISSIONS.ANPR_VIEW,
  PERMISSIONS.ROP_VIEW,
  PERMISSIONS.VEHICLE_RECORDS_VIEW,
  PERMISSIONS.CUSTOMERS_CREATE,
  PERMISSIONS.CUSTOMERS_VIEW,
  PERMISSIONS.CUSTOMERS_UPSERT,
  PERMISSIONS.JOBS_VIEW,
];

const TECHNICIAN_PERMISSIONS: Permission[] = [
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.JOBS_CREATE,
  PERMISSIONS.JOBS_VIEW,
  PERMISSIONS.JOBS_UPSERT,
  PERMISSIONS.ANPR_VIEW,
  PERMISSIONS.ROP_VIEW,
  PERMISSIONS.VEHICLE_RECORDS_VIEW,
];

function normalizeRole(role: string): string {
  return role.trim().toLowerCase().replace(/_/g, ' ').replace(/\s+/g, ' ');
}

/** Mirrors IVIS-Backend resolvePermissionsForRole */
export function resolvePermissionsForRole(role: string): Permission[] {
  const normalized = normalizeRole(role);

  if (FULL_ACCESS_ROLES.has(normalized)) {
    return ALL_PERMISSIONS;
  }

  if (normalized === 'receptionist') {
    return RECEPTIONIST_PERMISSIONS;
  }

  if (normalized === 'technician') {
    return TECHNICIAN_PERMISSIONS;
  }

  return [PERMISSIONS.USER_VIEW];
}
