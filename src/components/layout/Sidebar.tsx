import React from 'react';
import { useLocation } from 'react-router-dom';
import opalLogo from '../../assets/images/opal_logo.svg';
import { getUser, clearAuth } from '../../utils/storage';
import { authService } from '../../api/services/auth.service';

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

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuChange }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const location = useLocation();
  const [showPopup, setShowPopup] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement | null>(null);

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
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      clearAuth();
      window.location.href = '/login';
    }
  };

  const isConfiguration = location.pathname.startsWith('/configuration');
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'Configuration';

  const defaultMenuItems = [
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
      name: 'Payments',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      name: 'Vehicle Records',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M13 16h4.586a1 1 0 00.707-.293l2.414-2.414a1 1 0 00.293-.707V10a1 1 0 00-1-1h-7" />
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
      name: 'Customers',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      name: 'ROP Management',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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

  const configurationMenuItems = [
    {
      name: 'Centre Setup',
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    // {
    //   name: 'Admin PC',
    //   icon: (
    //     <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    //     </svg>
    //   )
    // },
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

  const menuItems = isConfiguration ? configurationMenuItems : defaultMenuItems;

  return (
    <aside className={`transition-all duration-300 ease-in-out flex-none bg-[#F5F6F8] border-r border-neutral-200 flex flex-col pt-5 pb-3 relative ${isCollapsed ? 'sidebar-collapsed' : 'w-[260px] px-4'}`}>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
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
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? (
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
      <div className={`sidebar-logo-container flex items-center justify-center ${isCollapsed ? 'mb-6 px-0 !pl-0 !pr-0' : 'justify-start'}`}>
        {isCollapsed ? (
          <div className="w-10 h-10 flex items-center justify-center bg-white border border-neutral-200/80 rounded-xl shadow-sm overflow-hidden flex-shrink-0">
            <img 
              src="/favicon.svg" 
              alt="OPAL Logo Icon" 
              className="w-7 h-7 object-contain" 
            />
          </div>
        ) : (
          <img src={opalLogo} alt="OPAL IVPMS Logo" className="w-[160px] h-auto object-contain" />
        )}
      </div>

      {/* Navigation Menu */}
      <nav className={`flex flex-col gap-y-1.5 ${isCollapsed ? 'px-0' : ''}`}>
        {menuItems.map((item) => {
          const isActive = isConfiguration ? activeTab === item.name : activeMenu === item.name;
          return (
            <button
              key={item.name}
              onClick={() => onMenuChange(item.name)}
              className={`sidebar-btn ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.name : undefined}
            >
              <div className="flex items-center gap-3 w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: isCollapsed ? '0px' : '12px' }}>
                {item.icon && (
                  <span style={{ color: isActive ? '#111827' : '#4a5568' }} className="flex-none transition-colors">
                    {item.icon}
                  </span>
                )}
                {(!isCollapsed || !item.icon) && <span className="truncate">{item.name}</span>}
              </div>
            </button>
          );
        })}
      </nav>

      {/* User Profile Section at bottom */}
      <div ref={profileRef} className={`relative mt-auto border-t border-neutral-200/60 pt-4 ${isCollapsed ? 'px-0 flex justify-center' : 'px-1'}`}>
        <button
          onClick={() => setShowPopup(!showPopup)}
          className={`flex items-center gap-3 w-full text-left p-2 hover:bg-neutral-200/50 rounded-xl transition-all cursor-pointer ${showPopup ? 'bg-neutral-200/50' : ''
            } ${isCollapsed ? 'justify-center' : ''}`}
        >
          {/* Avatar with initials */}
          <div className={`w-10 h-10 rounded-xl font-bold text-[16px] flex items-center justify-center shadow-sm flex-shrink-0 select-none transition-all ${avatarPalette.bg}`}>
            {userName.charAt(0).toUpperCase()}
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[13.5px] font-bold text-slate-800 truncate leading-snug">
                {userName}
              </span>
              <span className="text-[11.5px] font-semibold text-slate-500 truncate mt-0.5 uppercase tracking-wider">
                {roleName.replace(/_/g, ' ')}
              </span>
            </div>
          )}

          {!isCollapsed && (
            <svg className="w-4 h-4 text-slate-400 flex-shrink-0 ml-auto" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
            </svg>
          )}
        </button>

        {/* Mini Popover Sign Out */}
        {showPopup && (
          <div
            className={`absolute bg-white border border-neutral-100 rounded-xl shadow-xl p-1.5 z-[100] animate-fadeInMenu ${isCollapsed
              ? 'left-16 bottom-2 w-[180px]'
              : 'left-2 right-2 bottom-16'
              }`}
            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
          >
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-[13px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
