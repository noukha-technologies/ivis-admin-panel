import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import PrivateRoute from './PrivateRoute';
import MainLayout from '../components/layout/MainLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import AppointmentsPage from '../pages/appointments/AppointmentsPage';
import PaymentsPage from '../pages/payments/PaymentsPage';
import VehicleRecordsPage from '../pages/vehicle-records/VehicleRecordsPage';
import CustomersPage from '../pages/customers/CustomersPage';
import RopManagementPage from '../pages/rop-management/RopManagementPage';
import JobManagementPage from '../pages/job-management/JobManagementPage';
import MasterManagementPage from '../pages/master-management/MasterManagementPage';
import UsersPage from '../pages/users/UsersPage';
import ConfigurationPage from '../pages/configuration/ConfigurationPage';
import FileProcessingPage from '../pages/file-processing/FileProcessingPage';
import LoginPage from '../pages/auth/LoginPage';

/**
 * Root router configuration.
 * Add routes here as you build out features.
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect home directly to Login */}
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />

        {/* Login route */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        {/* Protected routes with layout */}
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.APPOINTMENTS} element={<AppointmentsPage />} />
          <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
          <Route path={ROUTES.VEHICLE_RECORDS} element={<VehicleRecordsPage />} />
          <Route path={ROUTES.CUSTOMERS} element={<CustomersPage />} />
          <Route path={ROUTES.ROP_MANAGEMENT} element={<RopManagementPage />} />
          <Route path={ROUTES.JOB_MANAGEMENT} element={<JobManagementPage />} />
          <Route path={ROUTES.MASTER_MANAGEMENT} element={<MasterManagementPage />} />
          <Route path={ROUTES.USERS} element={<UsersPage />} />
          <Route path={ROUTES.CONFIGURATION} element={<ConfigurationPage />} />
          <Route path={ROUTES.FILE_PROCESSING} element={<FileProcessingPage />} />
        </Route>

        {/* Error routes */}
        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
