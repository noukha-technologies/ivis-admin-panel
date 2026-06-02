import React from 'react';
import type { VehicleMasterStatus } from '../../interfaces/vehicle.interface';

interface VehicleStatusBadgeProps {
  status: VehicleMasterStatus;
}

export const VehicleStatusBadge: React.FC<VehicleStatusBadgeProps> = ({ status }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-2 w-2 items-center justify-center">
        {status === 'Active' ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </>
        ) : status === 'Suspended' ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </>
        ) : (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </>
        )}
      </div>
      <span className="text-[13.5px] font-medium text-neutral-700">{status}</span>
    </div>
  );
};

