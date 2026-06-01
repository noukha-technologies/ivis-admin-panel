import type { ReactNode } from 'react';
import type { Permission } from '../constants/permissions';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionGateProps {
  permission: Permission | Permission[];
  match?: 'any' | 'all';
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({
  permission,
  match = 'any',
  children,
  fallback = null,
}: PermissionGateProps) {
  const { hasAnyPermission, hasAllPermissions } = usePermissions();
  const keys = Array.isArray(permission) ? permission : [permission];
  const allowed =
    match === 'all' ? hasAllPermissions(...keys) : hasAnyPermission(...keys);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
