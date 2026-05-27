import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

type TabType = 'Vehicle' | 'Manual Test' | 'Centre' | 'Line' | 'Admin PC' | 'Camera / ANPR';

const tabs: { label: TabType; path: string }[] = [
  { label: 'Vehicle', path: '/master-management/vehicles' },
  { label: 'Manual Test', path: '/master-management/tests' },
  { label: 'Centre', path: '/master-management/centres' },
  { label: 'Line', path: '/master-management/lines' },
  { label: 'Admin PC', path: '/master-management/pcs' },
  { label: 'Camera / ANPR', path: '/master-management/cameras' },
];

const MasterManagementPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = (): TabType => {
    const path = location.pathname;
    if (path.endsWith('/tests')) return 'Manual Test';
    if (path.endsWith('/centres')) return 'Centre';
    if (path.endsWith('/lines')) return 'Line';
    if (path.endsWith('/pcs')) return 'Admin PC';
    if (path.endsWith('/cameras')) return 'Camera / ANPR';
    return 'Vehicle';
  };

  const activeTab = getActiveTab();

  return (
    <div className="w-full flex flex-col pt-3 pb-8">
      {/* Tabs Header bar (placed directly on the page background) */}
      <div className="mb-5 flex flex-row">
        <div className="inline-flex bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => navigate(tab.path)}
                className={`px-6 py-3 text-[13.5px] font-semibold transition-all duration-150 cursor-pointer border-r border-neutral-200 last:border-r-0 ${
                  isActive
                    ? 'bg-[#F5F7FA] text-[#101828] font-bold'
                    : 'bg-white text-[#475467] hover:bg-neutral-50 hover:text-[#101828]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subpage Content */}
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default MasterManagementPage;
