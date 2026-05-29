import React from 'react';
import { Outlet } from 'react-router-dom';

const MasterManagementPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col pt-3 pb-8">
      {/* Subpage Content */}
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default MasterManagementPage;
