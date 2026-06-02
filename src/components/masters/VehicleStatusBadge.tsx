import React from 'react';
import type { VehicleMasterStatus } from '../../interfaces/vehicle.interface';

interface VehicleStatusBadgeProps {
  status: VehicleMasterStatus;
}

export const VehicleStatusBadge: React.FC<VehicleStatusBadgeProps> = ({ status }) => {
  const styles: Record<VehicleMasterStatus, string> = {
    Active: 'bg-[#ecfdf5] text-[#027a48] border-[#d1fae5]',
    Inactive: 'bg-[#f9fafb] text-[#344054] border-[#eaecf0]',
    Suspended: 'bg-[#fef8e6] text-[#b45309] border-[#fde8bb]',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-lg text-[12.5px] font-semibold border select-none ${
        styles[status] || styles.Inactive
      }`}
    >
      {status}
    </span>
  );
};
