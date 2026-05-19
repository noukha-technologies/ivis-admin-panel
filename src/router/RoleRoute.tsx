import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from './routes';

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  userRole?: string;
}

/**
 * Role-based route guard — redirects to unauthorized if role mismatch.
 */
const RoleRoute = ({ children, allowedRoles, userRole }: RoleRouteProps) => {
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
