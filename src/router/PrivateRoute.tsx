import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/storage';
import { ROUTES } from './routes';

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * Auth guard — redirects to login if not authenticated.
 */
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = !!getToken();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
