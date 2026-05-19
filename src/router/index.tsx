import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './routes';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

/**
 * Root router configuration.
 * Add routes here as you build out features.
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        {/* <Route path={ROUTES.LOGIN} element={<LoginPage />} /> */}

        {/* Protected routes */}
        {/* <Route path={ROUTES.DASHBOARD} element={<PrivateRoute><DashboardPage /></PrivateRoute>} /> */}

        {/* Error routes */}
        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
