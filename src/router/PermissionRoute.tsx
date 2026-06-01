import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import type { Permission } from '../constants/permissions';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionRouteProps {
  children: ReactNode;
  required: Permission | Permission[];
  match?: 'any' | 'all';
}

const PermissionRoute = ({ children, required, match = 'any' }: PermissionRouteProps) => {
  const { hasAnyPermission, hasAllPermissions } = usePermissions();
  const keys = Array.isArray(required) ? required : [required];

  const allowed =
    match === 'all' ? hasAllPermissions(...keys) : hasAnyPermission(...keys);

  if (!allowed) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};

export default PermissionRoute;
