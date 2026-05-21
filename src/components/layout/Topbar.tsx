import React, { useState, useRef, useEffect } from 'react';
import topNavIcon from '../../assets/images/top_nav_icon.svg';

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

const menuItems = [
  { name: 'User Management', hasDivider: true },
  { name: 'Configuration', hasDivider: false },
  { name: 'Master Mangement', hasDivider: false },
  { name: 'File processing', hasDivider: false },
];

const Topbar: React.FC<TopbarProps> = ({ title, subtitle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      className="h-[80px] bg-white border-b border-neutral-200/50 px-6 flex items-center justify-between flex-none select-none"
      style={{
        marginBottom: '0px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.015)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Left side: Page title & subtitle */}
      <div style={{ paddingLeft: '4px' }}>
        {title && (
          <h1 className="text-[22px] font-bold text-[#111827] tracking-tight leading-tight">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-[13px] text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {/* Right side: Utilities / Apps Grid Menu */}
      <div className="flex items-center" style={{ paddingRight: '15px', position: 'relative' }} ref={menuRef}>
        <button
          title="Applications Menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-neutral-100 active:bg-neutral-200 transition-all cursor-pointer border border-transparent"
        >
          <img src={topNavIcon} alt="Apps Menu" className="w-[34px] h-[34px]" />
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
                    // TODO: handle navigation for each menu item
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '14px 24px',
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
                      margin: '4px 16px',
                    }}
                  />
                )}
              </React.Fragment>
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
