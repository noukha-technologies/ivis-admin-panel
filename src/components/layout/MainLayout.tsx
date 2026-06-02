import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { IntakeProvider } from '../../features/intake/IntakeContext';
import { ROUTES } from '../../router/routes';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/**
 * Shared layout wrapper with Sidebar + Topbar.
 * Child routes render inside <Outlet />.
 */

const menuToRoute: Record<string, string> = {
  'Dashboard': ROUTES.DASHBOARD,
  'Appointments': ROUTES.APPOINTMENTS,
  'Payments': ROUTES.PAYMENTS,
  'Vehicle Records': ROUTES.VEHICLE_RECORDS,
  'Job Management': ROUTES.JOB_MANAGEMENT,
  'Customers': ROUTES.CUSTOMERS,
  'ROP Management': ROUTES.ROP_MANAGEMENT,
  'Reports & Analytics': ROUTES.REPORTS,
  'Master Management': ROUTES.MASTER_MANAGEMENT,
  'User Management': ROUTES.USERS_MANAGEMENT,
  'Configuration': ROUTES.CONFIGURATION,
  'File Processing': ROUTES.FILE_PROCESSING,
};

const routeToMenu: Record<string, string> = Object.fromEntries(
  Object.entries(menuToRoute).map(([k, v]) => [v, k])
);

const routeToTitle: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.APPOINTMENTS]: 'Appointments & Walk-ins',
  [ROUTES.PAYMENTS]: 'Payments',
  [ROUTES.VEHICLE_RECORDS]: 'Vehicle Records',
  [ROUTES.JOB_MANAGEMENT]: 'Job Management',
  [ROUTES.CUSTOMERS]: 'Customers',
  [ROUTES.ROP_MANAGEMENT]: 'ROP Management',
  [ROUTES.REPORTS]: 'Reports & Analytics',
  [ROUTES.MASTER_MANAGEMENT]: 'Master Management',
  [ROUTES.MASTER_VEHICLES]: 'Vehicle Master',
  [ROUTES.MASTER_TESTS]: 'Manual Testing Master',
  [ROUTES.MASTER_CENTRES]: 'Centre Master',
  [ROUTES.MASTER_LINES]: 'Line Master',
  [ROUTES.MASTER_PCS]: 'Admin PC Master',
  [ROUTES.MASTER_CAMERAS]: 'Camera & ANPR Master',
  [ROUTES.MASTER_PAYMENTS]: 'Payments Master',
  [ROUTES.USERS_MANAGEMENT]: 'User Management',
  [ROUTES.USERS_ROLES]: 'Role & Permissions Management',
  [ROUTES.CONFIGURATION]: 'Configuration',
  [ROUTES.FILE_PROCESSING]: 'File Processing',
};

const routeToSubtitle: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Overview of today\'s activity',
  [ROUTES.APPOINTMENTS]: 'Manage scheduled appointments and walk-in entries',
  [ROUTES.PAYMENTS]: 'Track and manage payment records',
  [ROUTES.VEHICLE_RECORDS]: 'ANPR capture and ROP verification records',
  [ROUTES.JOB_MANAGEMENT]: 'Manage inspection jobs and assignments',
  [ROUTES.CUSTOMERS]: 'View and manage customer profiles',
  [ROUTES.ROP_MANAGEMENT]: 'ROP integration and management',
  [ROUTES.REPORTS]: 'Analytics and reporting insights',
  [ROUTES.MASTER_MANAGEMENT]: 'Vehicle types, categories, fuel & capacity ranges',
  [ROUTES.MASTER_VEHICLES]: 'Vehicle types, categories, fuel & capacity ranges',
  [ROUTES.MASTER_TESTS]: 'Manage testing categories, result types, and criteria',
  [ROUTES.MASTER_CENTRES]: 'Manage testing centers, locations, and operational capacities',
  [ROUTES.MASTER_LINES]: 'Inspection lines, lanes, and configurations per center',
  [ROUTES.MASTER_PCS]: 'Configured computer terminals and assigned receptionist users',
  [ROUTES.MASTER_CAMERAS]: 'Automatic Number Plate Recognition (ANPR) cameras and feed setups',
  [ROUTES.MASTER_PAYMENTS]: 'Manage payment options, modes, and operational configurations',
  [ROUTES.USERS_MANAGEMENT]: 'Manage system administrators, receptionists, and technical staff',
  [ROUTES.USERS_ROLES]: 'Manage access control, permissions, and roles',
  [ROUTES.CONFIGURATION]: 'Global application configurations, API keys, and settings',
  [ROUTES.FILE_PROCESSING]: 'Import, validate, and process external data files and ANPR logs',
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active menu from current URL path
  const getActiveMenu = () => {
    const path = location.pathname;
    if (path.startsWith(ROUTES.MASTER_MANAGEMENT)) return 'Master Management';
    if (path.startsWith('/transactions')) return 'Transactions';
    if (path.startsWith(ROUTES.USERS_MANAGEMENT)) return 'User Management';
    if (path.startsWith(ROUTES.JOB_MANAGEMENT)) return 'Job Management';
    if (path.startsWith(ROUTES.APPOINTMENTS)) return 'Appointments';
    if (path.startsWith(ROUTES.REPORTS)) return 'Reports & Analytics';
    if (path.startsWith(ROUTES.CONFIGURATION)) return 'Configuration';
    if (path.startsWith(ROUTES.DASHBOARD)) return 'Dashboard';
    return routeToMenu[path] || 'Dashboard';
  };

  const activeMenu = getActiveMenu();

  const isRolesPage = location.pathname === ROUTES.USERS_ROLES;
  const isUsersManagementPage =
    location.pathname.startsWith(ROUTES.USERS_MANAGEMENT) && !isRolesPage;

  const getPageTitle = () => {
    if (isRolesPage) return routeToTitle[ROUTES.USERS_ROLES];
    if (isUsersManagementPage) return routeToTitle[ROUTES.USERS_MANAGEMENT];
    
    const path = location.pathname;
    if (path.startsWith(ROUTES.JOB_MANAGEMENT)) return 'Job Management';
    if (path.startsWith(ROUTES.APPOINTMENTS)) return 'Appointments & Walk-ins';
    if (path.startsWith(ROUTES.REPORTS)) return 'Reports & Analytics';
    
    return routeToTitle[path] || 'Dashboard';
  };

  const getPageSubtitle = () => {
    if (isRolesPage) return routeToSubtitle[ROUTES.USERS_ROLES];
    if (isUsersManagementPage) return routeToSubtitle[ROUTES.USERS_MANAGEMENT];
    
    const path = location.pathname;
    if (path.startsWith(ROUTES.JOB_MANAGEMENT)) return 'Manage inspection jobs and assignments';
    if (path.startsWith(ROUTES.APPOINTMENTS)) return 'Manage scheduled appointments and walk-in entries';
    if (path.startsWith(ROUTES.REPORTS)) return 'Analytics and reporting insights';
    
    return routeToSubtitle[path] || '';
  };

  const pageTitle = getPageTitle();
  const pageSubtitle = getPageSubtitle();

  const handleMenuChange = (menuName: string) => {
    if (location.pathname.startsWith(ROUTES.CONFIGURATION)) {
      // For configuration sub-menus, we use query parameters
      navigate(`${ROUTES.CONFIGURATION}?tab=${encodeURIComponent(menuName)}`);
      return;
    }
    const route = menuToRoute[menuName];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8f9fc] font-sans antialiased text-[#222] overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />

      {/* Right Column Layout */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar Component */}
        <Topbar title={pageTitle} subtitle={pageSubtitle} isSidebarHidden={false} />

        {/* Main Content Area */}
        <main className="flex-1 bg-[#f8f9fc] pt-2 pb-6 px-6 overflow-y-auto" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <div className="w-full">
            <IntakeProvider>
              <Outlet />
            </IntakeProvider>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
