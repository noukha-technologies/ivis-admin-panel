import React from 'react';
import opalLogo from '../../assets/images/opal_logo.svg';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menuName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuChange }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
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
    },
  ];

  return (
    <aside className={`transition-all duration-300 ease-in-out flex-none bg-[#F5F6F8] border-r border-neutral-200 flex flex-col pt-5 pb-8 relative ${isCollapsed ? 'sidebar-collapsed' : 'w-[260px] px-4'}`}>
      
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
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#db4d4d] to-[#ff6b6b] flex items-center justify-center text-white font-bold text-[18px] shadow-sm">
            O
          </div>
        ) : (
          <img src={opalLogo} alt="OPAL IVPMS Logo" className="w-[160px] h-auto object-contain" />
        )}
      </div>

      {/* Navigation Menu */}
      <nav className={`flex flex-col gap-y-1.5 ${isCollapsed ? 'px-0' : ''}`}>
        {menuItems.map((item) => {
          const isActive = activeMenu === item.name;
          return (
            <button
              key={item.name}
              onClick={() => onMenuChange(item.name)}
              className={`sidebar-btn ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.name : undefined}
            >
              <div className="flex items-center gap-3 w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: isCollapsed ? '0px' : '12px' }}>
                <span style={{ color: isActive ? '#111827' : '#4a5568' }} className="flex-none transition-colors">
                  {item.icon}
                </span>
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
