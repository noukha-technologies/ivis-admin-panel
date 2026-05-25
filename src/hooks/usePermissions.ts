import { useMemo } from 'react';
import { PERMISSIONS, type Permission } from '../constants/permissions';
import { getToken, getUser, getPermissions } from '../utils/storage';

/**
 * Hook to check user permissions and roles from stored auth session.
 */
export function usePermissions() {
  const isAuthenticated = useMemo(() => !!getToken(), []);
  const user = useMemo(() => getUser(), [isAuthenticated]);

  const hasPermission = (permission: Permission): boolean => {
    if (!getToken()) return false;
    return getPermissions().includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user?.role) return false;
    return user.role.trim().toLowerCase() === role.trim().toLowerCase();
  };

  return {
    isAuthenticated,
    user,
    permissions: getPermissions(),
    hasPermission,
    hasRole,
    canViewUsers: hasPermission(PERMISSIONS.USER_VIEW),
    canCreateUsers: hasPermission(PERMISSIONS.USER_CREATE),
    canEditUsers: hasPermission(PERMISSIONS.USER_EDIT),
  };
}
