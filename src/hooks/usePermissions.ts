import { useCallback, useEffect, useMemo, useState } from 'react';
import { PERMISSIONS, type Permission } from '../constants/permissions';
import { AUTH_SESSION_UPDATED_EVENT } from '../utils/authSession';
import { getToken, getUser, getPermissions } from '../utils/storage';

/**
 * Hook to check user permissions from stored auth session (DB role_access via login API).
 */
export function usePermissions() {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const onSessionUpdated = () => setRevision((n) => n + 1);
    window.addEventListener(AUTH_SESSION_UPDATED_EVENT, onSessionUpdated);
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'auth_permissions' || e.key === 'auth_token') {
        setRevision((n) => n + 1);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(AUTH_SESSION_UPDATED_EVENT, onSessionUpdated);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const isAuthenticated = useMemo(() => !!getToken(), [revision]);
  const user = useMemo(() => getUser(), [revision]);
  const permissions = useMemo(() => getPermissions(), [revision]);

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!getToken()) return false;
      return permissions.includes(permission);
    },
    [permissions],
  );

  const hasAnyPermission = useCallback(
    (...keys: Permission[]): boolean => {
      if (!getToken()) return false;
      return keys.some((key) => permissions.includes(key));
    },
    [permissions],
  );

  const hasAllPermissions = useCallback(
    (...keys: Permission[]): boolean => {
      if (!getToken()) return false;
      return keys.every((key) => permissions.includes(key));
    },
    [permissions],
  );

  const hasRole = useCallback(
    (role: string): boolean => {
      if (!user?.role) return false;
      return user.role.trim().toLowerCase() === role.trim().toLowerCase();
    },
    [user],
  );

  return {
    isAuthenticated,
    user,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    canViewDashboard: hasPermission(PERMISSIONS.DASHBOARD_VIEW),
    canViewAppointments: hasPermission(PERMISSIONS.APPOINTMENTS_VIEW),
    canCreateAppointments: hasPermission(PERMISSIONS.APPOINTMENTS_CREATE),
    canEditAppointments: hasPermission(PERMISSIONS.APPOINTMENTS_UPSERT),
    canViewPayments: hasPermission(PERMISSIONS.PAYMENTS_VIEW),
    canCreatePayments: hasPermission(PERMISSIONS.PAYMENTS_CREATE),
    canEditPayments: hasPermission(PERMISSIONS.PAYMENTS_UPSERT),
    canViewJobs: hasPermission(PERMISSIONS.JOBS_VIEW),
    canCreateJobs: hasPermission(PERMISSIONS.JOBS_CREATE),
    canEditJobs: hasPermission(PERMISSIONS.JOBS_UPSERT),
    canViewMasters: hasPermission(PERMISSIONS.MASTERS_VIEW),
    canCreateMasters: hasPermission(PERMISSIONS.MASTERS_CREATE),
    canEditMasters: hasPermission(PERMISSIONS.MASTERS_UPSERT),
    canDeleteMasters: hasPermission(PERMISSIONS.MASTERS_DELETE),
    canViewVehicleRecords: hasPermission(PERMISSIONS.VEHICLE_RECORDS_VIEW),
    canViewCustomers: hasPermission(PERMISSIONS.CUSTOMERS_VIEW),
    canViewRop: hasPermission(PERMISSIONS.ROP_VIEW),
    canViewFileProcessing: hasPermission(PERMISSIONS.FILE_PROCESSING_VIEW),
    canViewReports: hasPermission(PERMISSIONS.REPORTS_VIEW),
    canViewConfiguration: hasPermission(PERMISSIONS.CONFIGURATION_VIEW),
    canViewUsers: hasPermission(PERMISSIONS.USER_VIEW),
    canCreateUsers: hasPermission(PERMISSIONS.USER_CREATE),
    canEditUsers: hasPermission(PERMISSIONS.USER_EDIT),
    canDeleteUsers: hasPermission(PERMISSIONS.USER_DELETE),
    canViewRoles: hasPermission(PERMISSIONS.PERMISSIONS_VIEW),
    canManageRoles: hasPermission(PERMISSIONS.PERMISSIONS_UPSERT),
    canDeleteRoles: hasPermission(PERMISSIONS.PERMISSIONS_DELETE),
  };
}
