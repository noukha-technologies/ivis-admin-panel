import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import opalLogo from '../../assets/images/opal_logo.svg';
import { getUser, clearAuth } from '../../utils/storage';
import { authService } from '../../api/services/auth.service';
import { toast } from 'sonner';
import { useAppStore } from '../../store/app.store';

const AVATAR_COLOR_PALETTES = [
  { bg: 'bg-indigo-50 border border-indigo-200 text-indigo-700' },
  { bg: 'bg-emerald-50 border border-emerald-200 text-emerald-700' },
  { bg: 'bg-sky-50 border border-sky-200 text-sky-700' },
  { bg: 'bg-amber-50 border border-amber-200 text-amber-700' },
  { bg: 'bg-rose-50 border border-rose-200 text-rose-700' },
  { bg: 'bg-violet-50 border border-violet-200 text-violet-700' },
  { bg: 'bg-teal-50 border border-teal-200 text-teal-700' },
  { bg: 'bg-orange-50 border border-orange-200 text-orange-700' },
];

const getAvatarPalette = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLOR_PALETTES.length;
  return AVATAR_COLOR_PALETTES[index];
};

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menuName: string) => void;
}

interface MenuItem {
  name: string;
  icon?: React.ReactNode;
  isCollapsible?: boolean;
  subItems?: { name: string; path: string }[];
  path?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuChange }) => {
  const { sidebarCollapsed, toggleSidebarCollapsed } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement | null>(null);

  const [expandedMenus, setExpandedMenus] = React.useState<Record<string, boolean>>({
    Transactions: true, // expand by default
  });

  const toggleMenuExpanded = (menuName: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const user = getUser();
  const userName = user?.user_name || 'User';
  const roleName = user?.role || 'Guest';
  const avatarPalette = getAvatarPalette(userName);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Successfully signed out.');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      clearAuth();
      window.location.href = '/login';
    }
  };

  const isConfiguration = location.pathname.startsWith('/configuration');
  const isTransactions = location.pathname.startsWith('/transactions');
  const isMasterManagement = location.pathname.startsWith('/master-management');
  const isUserManagement = location.pathname.startsWith(ROUTES.USERS_MANAGEMENT);
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'Configuration';

  const masterMenuItems: MenuItem[] = [
    {
      name: 'Vehicle',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-none"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></svg>
      ),
      path: '/master-management/vehicles'
    },
    {
      name: 'Manual Test',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-none"><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg>
      ),
      path: '/master-management/tests'
    },
    {
      name: 'Centre',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-none"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="9" y1="22" x2="9" y2="16" /><line x1="15" y1="22" x2="15" y2="16" /><line x1="9" y1="16" x2="15" y2="16" /><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M12 6h.01M12 10h.01" /></svg>
      ),
      path: '/master-management/centres'
    },
    {
      name: 'Line',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-road-icon lucide-road"><path d="M12 17v4" /><path d="M12 5V3" /><path d="M12 9v3" /><path d="M2.077 18.449A2 2 0 0 0 4 21h16a2 2 0 0 0 1.924-2.55l-4-14A2 2 0 0 0 16 3H8a2 2 0 0 0-1.924 1.45z" /></svg>
      ),
      path: '/master-management/lines'
    },
    {
      name: 'Admin PC',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-none"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
      ),
      path: '/master-management/pcs'
    },
    {
      name: 'Camera / ANPR',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-none"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
      ),
      path: '/master-management/cameras'
    },
    {
      name: 'Payments',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 8h20L12 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 8v10M12 8v10M18 8v10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18h18M4 21h16" />
        </svg>
      ),
      path: '/master-management/payments'
    }
  ];

  const transactionsMenuItems: MenuItem[] = [
    {
      name: 'Payments',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 8h20L12 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 8v10M12 8v10M18 8v10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18h18M4 21h16" />
        </svg>
      ),
      path: '/transactions/payments'
    },
    {
      name: 'Vehicle Records',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-none"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></svg>
      ),
      path: '/transactions/vehicle-records'
    },
    {
      name: 'Customers',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-none"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
      ),
      path: '/transactions/customers'
    },
    {
      name: 'File Processing',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-none"><path d="M14.5 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v3.8" /><path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="M11.7 14.2 7 17l-4.7-2.8" /><path d="M3 13.1a2 2 0 0 0-.999 1.76v3.24a2 2 0 0 0 .969 1.78L6 21.7a2 2 0 0 0 2.03.01L11 19.9a2 2 0 0 0 1-1.76V14.9a2 2 0 0 0-.97-1.78L8 11.3a2 2 0 0 0-2.03-.01z" /><path d="M7 17v5" /></svg>
      ),
      path: '/transactions/file-processing'
    },
    {
      name: 'ROP Management',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286z" />
        </svg>
      ),
      path: '/transactions/rop-management'
    }
  ];

  const defaultMenuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    {
      name: 'Appointments',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: 'Job Management',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: 'Reports & Analytics',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      )
    }
  ];

  const configurationMenuItems: MenuItem[] = [
    {
      name: 'Centre Setup',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      name: 'Line',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )
    },
    {
      name: 'ANPR',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      name: 'Charges',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'Manual Tests',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    }
  ];

  const userMenuItems: MenuItem[] = [
    {
      name: 'Users',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-none">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      path: ROUTES.USERS_MANAGEMENT
    },
    {
      name: 'Roles',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-none">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      path: ROUTES.USERS_ROLES
    }
  ];

  const menuItems = isConfiguration
    ? configurationMenuItems
    : isTransactions
      ? transactionsMenuItems
      : isMasterManagement
        ? masterMenuItems
        : isUserManagement
          ? userMenuItems
          : defaultMenuItems;

  return (
    <aside className={`transition-all duration-300 ease-in-out flex-none bg-[#F5F6F8] border-r border-neutral-200 flex flex-col pt-5 pb-3 relative ${sidebarCollapsed ? 'sidebar-collapsed' : 'w-65 px-4'}`}>

      {/* Collapse Toggle Button */}
      <button
        onClick={toggleSidebarCollapsed}
        className="absolute w-6 h-6 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center cursor-pointer text-gray-500 hover:text-gray-800 hover:bg-neutral-50 transition-all"
        style={{
          right: '-12px',
          top: '28px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
        }}
        title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {sidebarCollapsed ? (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        )}
      </button>

      {/* Logo */}
      <div className={`sidebar-logo-container flex items-center justify-center ${sidebarCollapsed ? 'mb-6 px-0 pl-0! pr-0!' : 'justify-start'}`}>
        {sidebarCollapsed ? (
          <div className="w-10 h-10 flex items-center justify-center bg-white border border-neutral-200/80 rounded-xl shadow-sm overflow-hidden shrink-0">
            <img
              src="/favicon.svg"
              alt="OPAL Logo Icon"
              className="w-7 h-7 object-contain"
            />
          </div>
        ) : (
          <img src={opalLogo} alt="OPAL IVPMS Logo" className="w-40 h-auto object-contain" />
        )}
      </div>

      {/* Navigation Menu */}
      <nav className={`flex flex-col gap-y-3 mt-2 ${sidebarCollapsed ? 'px-0' : ''}`}>
        {menuItems.map((item) => {
          const isExpanded = expandedMenus[item.name];
          const isSubItemActive = !!(item.subItems && item.subItems.some(sub => location.pathname === sub.path));

          const isActive = isTransactions
            ? location.pathname === item.path
            : isMasterManagement
              ? location.pathname === item.path
              : isUserManagement
                ? (item.path === ROUTES.USERS_ROLES
                  ? location.pathname === ROUTES.USERS_ROLES
                  : location.pathname.startsWith(ROUTES.USERS_MANAGEMENT) && location.pathname !== ROUTES.USERS_ROLES)
                : isConfiguration
                  ? activeTab === item.name
                  : item.subItems
                    ? isSubItemActive
                    : activeMenu === item.name;

          if (item.subItems && item.subItems.length > 0) {
            return (
              <div key={item.name} className="flex flex-col w-full">
                {/* Parent Button */}
                <button
                  onClick={() => {
                    if (sidebarCollapsed) {
                      toggleSidebarCollapsed();
                      setExpandedMenus(prev => ({ ...prev, [item.name]: true }));
                    } else {
                      toggleMenuExpanded(item.name);
                    }
                  }}
                  className={`sidebar-btn flex items-center justify-between transition-all cursor-pointer ${isActive ? 'bg-neutral-200/50 text-[#111827]' : 'text-slate-700 hover:bg-neutral-200/30'}`}
                  style={{
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    paddingLeft: sidebarCollapsed ? '0px' : '16px',
                    paddingRight: sidebarCollapsed ? '0px' : '16px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                  }}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: sidebarCollapsed ? '0px' : '12px' }}>
                    {item.icon && (
                      <span className={`flex-none transition-colors ${isActive ? 'text-[#111827]' : 'text-slate-600'}`}>
                        {item.icon}
                      </span>
                    )}
                    {!sidebarCollapsed && <span className="font-semibold text-[14px]">{item.name}</span>}
                  </div>

                  {!sidebarCollapsed && (
                    <svg
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  )}
                </button>

                {/* Sub-items List (only rendered when not collapsed and is expanded) */}
                {!sidebarCollapsed && isExpanded && (
                  <div className="flex flex-col gap-y-1 mt-1 pl-4 border-l-2 border-neutral-200 ml-6 animate-fadeInSubmenu">
                    {item.subItems.map((sub) => {
                      const isSubActive = location.pathname === sub.path;
                      return (
                        <button
                          key={sub.name}
                          onClick={() => {
                            navigate(sub.path);
                          }}
                          className={`w-full text-left py-2 px-3 text-[13px] font-medium rounded-lg transition-all duration-150 cursor-pointer ${isSubActive
                            ? 'bg-neutral-900 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-neutral-200/40 hover:text-slate-900'
                            }`}
                        >
                          {sub.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.name}
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                } else {
                  onMenuChange(item.name);
                }
              }}
              className={`sidebar-btn ${isActive ? 'active' : ''}`}
              title={sidebarCollapsed ? item.name : undefined}
            >
              <div className="flex items-center gap-3 w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: sidebarCollapsed ? '0px' : '12px' }}>
                {item.icon && (
                  <span style={{ color: isActive ? '#111827' : '#4a5568' }} className="flex-none transition-colors">
                    {item.icon}
                  </span>
                )}
                {(!sidebarCollapsed || !item.icon) && <span className="truncate">{item.name}</span>}
              </div>
            </button>
          );
        })}
      </nav>

      {/* User Profile Section at bottom */}
      <div ref={profileRef} className={`relative mt-auto border-t border-neutral-200/60 pt-4 ${sidebarCollapsed ? 'px-0 flex justify-center' : 'px-1'}`}>
        <button
          onClick={() => setShowPopup(!showPopup)}
          className={`flex items-center gap-3 w-full text-left p-2 hover:bg-neutral-200/50 rounded-xl transition-all cursor-pointer ${showPopup ? 'bg-neutral-200/50' : ''
            } ${sidebarCollapsed ? 'justify-center' : ''}`}
        >
          {/* Avatar with initials */}
          <div className={`w-10 h-10 rounded-xl font-bold text-[16px] flex items-center justify-center shadow-sm shrink-0 select-none transition-all ${avatarPalette.bg}`}>
            {userName.charAt(0).toUpperCase()}
          </div>

          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[13.5px] font-bold text-slate-800 truncate leading-snug">
                {userName}
              </span>
              <span className="text-[11.5px] font-semibold text-slate-500 truncate mt-0.5 uppercase tracking-wider">
                {roleName.replace(/_/g, ' ')}
              </span>
            </div>
          )}

          {!sidebarCollapsed && (
            <svg className="w-4 h-4 text-slate-400 shrink-0 ml-auto" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
            </svg>
          )}
        </button>

        {/* Mini Popover Sign Out */}
        {showPopup && (
          <div
            className={`absolute bg-white border border-neutral-100 rounded-xl shadow-xl p-1.5 z-100 animate-fadeInMenu ${sidebarCollapsed
              ? 'left-16 bottom-2 w-45'
              : 'left-2 right-2 bottom-16'
              }`}
            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
          >
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-[13px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInSubmenu {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInSubmenu {
          animation: fadeInSubmenu 0.15s ease-out forwards;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
