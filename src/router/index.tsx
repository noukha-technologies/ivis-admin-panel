import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import LoginPage from '../pages/auth/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import MainLayout from '../components/layout/MainLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import AppointmentsPage from '../pages/appointments/AppointmentsPage';
import PaymentsPage from '../pages/payments/PaymentsPage';
import VehicleRecordsPage from '../pages/vehicle-records/VehicleRecordsPage';
import CustomersPage from '../pages/customers/CustomersPage';
import RopManagementPage from '../pages/rop-management/RopManagementPage';
import JobManagementPage from '../pages/job-management/JobManagementPage';
import ReportsPage from '../pages/reports/ReportsPage';
import MasterManagementPage from '../pages/master-management/MasterManagementPage';
import VehicleMasterPage from '../pages/master-management/VehicleMasterPage';
import TestMasterPage from '../pages/master-management/TestMasterPage';
import CentreMasterPage from '../pages/master-management/CentreMasterPage';
import LineMasterPage from '../pages/master-management/LineMasterPage';
import AdminPcMasterPage from '../pages/master-management/AdminPcMasterPage';
import CameraMasterPage from '../pages/master-management/CameraMasterPage';
import PaymentMasterPage from '../pages/master-management/PaymentMasterPage';
import UsersPage from '../pages/users/UsersPage';
import ConfigurationPage from '../pages/configuration/ConfigurationPage';
import FileProcessingPage from '../pages/file-processing/FileProcessingPage';

/**
 * Root router configuration.
 * Add routes here as you build out features.
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.LOGIN} element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />

        {/* Protected routes with layout */}
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="/transactions" element={<Navigate to={ROUTES.PAYMENTS} replace />} />
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.APPOINTMENTS} element={<AppointmentsPage />} />
          <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
          <Route path={ROUTES.VEHICLE_RECORDS} element={<VehicleRecordsPage />} />
          <Route path={ROUTES.CUSTOMERS} element={<CustomersPage />} />
          <Route path={ROUTES.ROP_MANAGEMENT} element={<RopManagementPage />} />
          <Route path={ROUTES.JOB_MANAGEMENT} element={<JobManagementPage />} />
          <Route path={ROUTES.REPORTS} element={<ReportsPage />} />

          <Route path={ROUTES.MASTER_MANAGEMENT} element={<MasterManagementPage />}>
            <Route index element={<Navigate to={ROUTES.MASTER_VEHICLES} replace />} />
            <Route path="vehicles" element={<VehicleMasterPage />} />
            <Route path="tests" element={<TestMasterPage />} />
            <Route path="centres" element={<CentreMasterPage />} />
            <Route path="lines" element={<LineMasterPage />} />
            <Route path="pcs" element={<AdminPcMasterPage />} />
            <Route path="cameras" element={<CameraMasterPage />} />
            <Route path="payments" element={<PaymentMasterPage />} />
          </Route>

          <Route path={ROUTES.USERS_MANAGEMENT} element={<UsersPage />} />
          <Route path={ROUTES.USERS_ROLES} element={<UsersPage />} />
          <Route path="/users" element={<Navigate to={ROUTES.USERS_MANAGEMENT} replace />} />
          <Route path="/users/roles" element={<Navigate to={ROUTES.USERS_ROLES} replace />} />
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
