import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/**
 * Shared layout wrapper with Sidebar + Topbar.
 * Child routes render inside <Outlet />.
 */

const menuToRoute: Record<string, string> = {
  'Dashboard': '/dashboard',
  'Appointments': '/appointments',
  'Payments': '/payments',
  'Vehicle Records': '/vehicle-records',
  'Job Management': '/job-management',
  'Customers': '/customers',
  'ROP Management': '/rop-management',
  'Reports & Analytics': '/reports',
  'Master Management': '/master-management',
  'User Management': '/users',
  'Configuration': '/configuration',
  'File processing': '/file-processing',
};

const routeToMenu: Record<string, string> = Object.fromEntries(
  Object.entries(menuToRoute).map(([k, v]) => [v, k])
);

const routeToTitle: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/appointments': 'Appointments & Walk-ins',
  '/payments': 'Payments',
  '/vehicle-records': 'Vehicle Records',
  '/job-management': 'Job Management',
  '/customers': 'Customers',
  '/rop-management': 'ROP Management',
  '/reports': 'Reports & Analytics',
  '/master-management': 'Master Management',
  '/users': 'User Management',
  '/configuration': 'Configuration',
  '/file-processing': 'File Processing',
};

const routeToSubtitle: Record<string, string> = {
  '/dashboard': 'Overview of today\'s activity',
  '/appointments': 'Manage scheduled appointments and walk-in entries',
  '/payments': 'Track and manage payment records',
  '/vehicle-records': 'ANPR capture and ROP verification records',
  '/job-management': 'Manage inspection jobs and assignments',
  '/customers': 'View and manage customer profiles',
  '/rop-management': 'ROP integration and management',
  '/reports': 'Analytics and reporting insights',
  '/master-management': 'Vehicle types, categories, fuel & capacity ranges',
  '/users': 'Manage system administrators, receptionists, and technical staff',
  '/configuration': 'Global application configurations, API keys, and settings',
  '/file-processing': 'Import, validate, and process external data files and ANPR logs',
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active menu from current URL path
  const activeMenu = routeToMenu[location.pathname] || 'Dashboard';
  const pageTitle = routeToTitle[location.pathname] || 'Dashboard';
  const pageSubtitle = routeToSubtitle[location.pathname] || '';

  const handleMenuChange = (menuName: string) => {
    if (location.pathname.startsWith('/configuration')) {
      // For configuration sub-menus, we use query parameters
      navigate(`/configuration?tab=${encodeURIComponent(menuName)}`);
      return;
    }
    const route = menuToRoute[menuName];
    if (route) {
      navigate(route);
    }
  };

  // Hide the sidebar on management screens (except configuration which has its own sidebar menu)
  const managementRoutes = ['/master-management', '/users', '/file-processing'];
  const isSidebarHidden = managementRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen w-full bg-[#f8f9fc] font-sans antialiased text-[#222] overflow-hidden">
      {/* Sidebar Navigation */}
      {!isSidebarHidden && (
        <Sidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />
      )}

      {/* Right Column Layout */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar Component */}
        <Topbar title={pageTitle} subtitle={pageSubtitle} isSidebarHidden={isSidebarHidden} />

        {/* Main Content Area */}
        <main className="flex-1 bg-[#f8f9fc] pt-2 pb-6 px-6 overflow-y-auto" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
