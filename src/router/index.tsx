import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import { PERMISSIONS } from '../constants/permissions';
import LoginPage from '../pages/auth/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import PrivateRoute from './PrivateRoute';
import PermissionRoute from './PermissionRoute';
import PublicRoute from './PublicRoute';
import MainLayout from '../components/layout/MainLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import AppointmentsPage from '../pages/appointments/AppointmentsPage';
import PaymentsPage from '../pages/payments/PaymentsPage';
import VehicleRecordsPage from '../pages/vehicle-records/VehicleRecordsPage';
import CustomersPage from '../pages/customers/CustomersPage';
import RopManagementPage from '../pages/rop-management/RopManagementPage';
import JobManagementPage from '../pages/job-management/JobManagementPage';
import JobDetailPage from '../pages/job-management/JobDetailPage';
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

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />

        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="/transactions" element={<Navigate to={ROUTES.PAYMENTS} replace />} />
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <PermissionRoute required={PERMISSIONS.DASHBOARD_VIEW}>
                <DashboardPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.APPOINTMENTS}
            element={
              <PermissionRoute required={PERMISSIONS.APPOINTMENTS_VIEW}>
                <AppointmentsPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.PAYMENTS}
            element={
              <PermissionRoute required={PERMISSIONS.PAYMENTS_VIEW}>
                <PaymentsPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.VEHICLE_RECORDS}
            element={
              <PermissionRoute required={PERMISSIONS.VEHICLE_RECORDS_VIEW}>
                <VehicleRecordsPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.CUSTOMERS}
            element={
              <PermissionRoute required={PERMISSIONS.CUSTOMERS_VIEW}>
                <CustomersPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.ROP_MANAGEMENT}
            element={
              <PermissionRoute required={PERMISSIONS.ROP_VIEW}>
                <RopManagementPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.JOB_MANAGEMENT}
            element={
              <PermissionRoute required={PERMISSIONS.JOBS_VIEW}>
                <JobManagementPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.REPORTS}
            element={
              <PermissionRoute required={PERMISSIONS.REPORTS_VIEW}>
                <ReportsPage />
              </PermissionRoute>
            }
          />

          <Route
            path={ROUTES.MASTER_MANAGEMENT}
            element={
              <PermissionRoute required={PERMISSIONS.MASTERS_VIEW}>
                <MasterManagementPage />
              </PermissionRoute>
            }
          >
            <Route index element={<Navigate to={ROUTES.MASTER_VEHICLES} replace />} />
            <Route path="vehicles" element={<VehicleMasterPage />} />
            <Route path="tests" element={<TestMasterPage />} />
            <Route path="centres" element={<CentreMasterPage />} />
            <Route path="lines" element={<LineMasterPage />} />
            <Route path="pcs" element={<AdminPcMasterPage />} />
            <Route path="cameras" element={<CameraMasterPage />} />
            <Route path="payments" element={<PaymentMasterPage />} />
          </Route>

          <Route
            path={ROUTES.USERS_MANAGEMENT}
            element={
              <PermissionRoute required={PERMISSIONS.USER_VIEW}>
                <UsersPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.USERS_ROLES}
            element={
              <PermissionRoute required={PERMISSIONS.PERMISSIONS_VIEW}>
                <UsersPage />
              </PermissionRoute>
            }
          />
          <Route path="/users" element={<Navigate to={ROUTES.USERS_MANAGEMENT} replace />} />
          <Route path="/users/roles" element={<Navigate to={ROUTES.USERS_ROLES} replace />} />
          <Route
            path={ROUTES.CONFIGURATION}
            element={
              <PermissionRoute required={PERMISSIONS.CONFIGURATION_VIEW}>
                <ConfigurationPage />
              </PermissionRoute>
            }
          />
          <Route
            path={ROUTES.FILE_PROCESSING}
            element={
              <PermissionRoute required={PERMISSIONS.FILE_PROCESSING_VIEW}>
                <FileProcessingPage />
              </PermissionRoute>
            }
          />
        </Route>

        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
