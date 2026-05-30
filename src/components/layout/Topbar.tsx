import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import topNavIcon from '../../assets/images/top_nav_icon.svg';

interface TopbarProps {
  title?: string;
  subtitle?: string;
  isSidebarHidden?: boolean;
}

const menuItems = [
  { name: 'User Management' },
  { name: 'Configuration' },
  { name: 'Master Management' },
  { name: 'Transactions' },
];

const itemRouteMap: Record<string, string> = {
  'Dashboard': ROUTES.DASHBOARD,
  'User Management': ROUTES.USERS_MANAGEMENT,
  'Configuration': ROUTES.CONFIGURATION,
  'Master Management': ROUTES.MASTER_MANAGEMENT,
  'Transactions': ROUTES.PAYMENTS,
};

const Topbar = ({ title, subtitle, isSidebarHidden = false }: TopbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const showDashboard =
    location.pathname.startsWith('/users-management') ||
    location.pathname.startsWith('/roles') ||
    location.pathname.startsWith('/configuration') ||
    location.pathname.startsWith('/master-management') ||
    location.pathname.startsWith('/payments') ||
    location.pathname.startsWith('/vehicle-records') ||
    location.pathname.startsWith('/rop-management') ||
    location.pathname.startsWith('/customers') ||
    location.pathname.startsWith('/transactions');

  const currentMenuItems = showDashboard
    ? [{ name: 'Dashboard' }, ...menuItems]
    : menuItems;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header
      className="h-20 bg-white border-b border-neutral-200/50 px-6 flex items-center justify-between flex-none select-none"
      style={{
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.015)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Left side: Back button (if sidebar hidden) + Page title & subtitle */}
      <div className="flex items-center gap-3" style={{ paddingLeft: '4px' }}>
        {isSidebarHidden && (
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="p-2 mr-2 flex items-center justify-center rounded-xl bg-white border border-neutral-200 text-[#475467] hover:text-[#101828] hover:bg-neutral-50 active:bg-neutral-100 transition-all cursor-pointer shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
            title="Back to Dashboard"
          >
            <svg className="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
        )}
        <div>
          {title && (
            <h1 className="text-[22px] font-bold text-[#111827] tracking-tight leading-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-[13px] text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {/* Right side: Utilities / Apps Grid Menu */}
      <div className="flex items-center" style={{ paddingRight: '15px', position: 'relative' }} ref={menuRef}>
        <button
          title="Applications Menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-neutral-100 active:bg-neutral-200 transition-all cursor-pointer border border-transparent"
        >
          <img src={topNavIcon} alt="Apps Menu" className="w-8.5 h-8.5" />
        </button>
 
        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: '0',
              minWidth: '220px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              padding: '0',
              zIndex: 100,
              overflow: 'hidden',
              animation: 'fadeInMenu 0.15s ease-out',
            }}
          >
            {currentMenuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsMenuOpen(false);
                  const dest = itemRouteMap[item.name];
                  if (dest) {
                    if (item.name === 'Dashboard') {
                      navigate(dest);
                    } else {
                      window.open(dest, '_blank');
                    }
                  }
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '11px 20px',
                  fontSize: '14.5px',
                  fontWeight: 500,
                  color: '#1a1a2e',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: idx < currentMenuItems.length - 1 ? '1px solid #f1f5f9' : 'none',
                  cursor: 'pointer',
                  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                  transition: 'background-color 0.15s ease',
                  letterSpacing: '-0.01em',
                  borderTopLeftRadius: idx === 0 ? '12px' : '0',
                  borderTopRightRadius: idx === 0 ? '12px' : '0',
                  borderBottomLeftRadius: idx === currentMenuItems.length - 1 ? '12px' : '0',
                  borderBottomRightRadius: idx === currentMenuItems.length - 1 ? '12px' : '0',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Keyframe animation injected inline */}
      <style>{`
        @keyframes fadeInMenu {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
};

export default Topbar;
