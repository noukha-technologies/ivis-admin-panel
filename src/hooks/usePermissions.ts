import { useMemo } from 'react';
import { PERMISSIONS } from '../constants/permissions';
import { getToken } from '../utils/storage';

/**
 * Hook to check user permissions and roles.
 * Extend this to decode JWT or pull from auth store.
 */
export function usePermissions() {
  const isAuthenticated = useMemo(() => !!getToken(), []);

  const hasPermission = (_permission: keyof typeof PERMISSIONS): boolean => {
    // TODO: Implement actual permission checking logic
    return isAuthenticated;
  };

  const hasRole = (_role: string): boolean => {
    // TODO: Implement actual role checking logic
    return isAuthenticated;
  };

  return {
    isAuthenticated,
    hasPermission,
    hasRole,
  };
}
