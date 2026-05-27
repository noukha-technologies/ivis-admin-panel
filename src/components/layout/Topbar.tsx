import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/services/auth.service';
import { ROUTES } from '../../router/routes';
import topNavIcon from '../../assets/images/top_nav_icon.svg';
import { toast } from 'react-hot-toast';

interface TopbarProps {
  title?: string;
  subtitle?: string;
  isSidebarHidden?: boolean;
}

const menuItems = [
  { name: 'Dashboard', hasDivider: true },
  { name: 'User Management', hasDivider: true },
  { name: 'Configuration', hasDivider: false },
  { name: 'Master Management', hasDivider: false },
  { name: 'File processing', hasDivider: false },
];

const itemRouteMap: Record<string, string> = {
  'Dashboard': '/dashboard',
  'User Management': '/users',
  'Configuration': '/configuration',
  'Master Management': '/master-management',
  'File processing': '/file-processing',
};

const Topbar: React.FC<TopbarProps> = ({ title, subtitle, isSidebarHidden = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsMenuOpen(false);
    try {
      await authService.logout();
      toast.success('Successfully signed out.');
    } catch {
      // clearAuth runs in authService.finally
    }
    navigate(ROUTES.LOGIN);
  };

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
            onClick={() => navigate('/dashboard')}
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
              minWidth: '240px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
              border: '1px solid #f0f0f0',
              padding: '8px 0',
              zIndex: 100,
              animation: 'fadeInMenu 0.15s ease-out',
            }}
          >
            {menuItems.map((item, idx) => (
              <React.Fragment key={idx}>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    const dest = itemRouteMap[item.name];
                    if (dest) {
                      window.open(dest, '_blank');
                    }
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 24px',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#1a1a2e',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                    transition: 'background-color 0.15s ease',
                    letterSpacing: '-0.01em',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f5f6f8';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                  }}
                >
                  {item.name}
                </button>
                {item.hasDivider && (
                  <div
                    style={{
                      height: '1px',
                      backgroundColor: '#e5e7eb',
                      margin: '2px 16px',
                    }}
                  />
                )}
              </React.Fragment>
            ))}
            <div
              style={{
                height: '1px',
                backgroundColor: '#e5e7eb',
                margin: '2px 16px',
              }}
            />
            <button
              onClick={handleLogout}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px 24px',
                fontSize: '15px',
                fontWeight: 500,
                color: '#b42318',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#fef3f2';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              Sign out
            </button>
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
