import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/storage';
import { ROUTES } from './routes';

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * Public route guard — redirects to dashboard if already authenticated.
 */
const PublicRoute = ({ children }: PublicRouteProps) => {
  const isAuthenticated = !!getToken();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
