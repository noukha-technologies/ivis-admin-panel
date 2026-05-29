import React from 'react';
import type { AppointmentCalendarItem } from '@/features/appointments/types';

interface AppointmentDetailModalProps {
  appointment: AppointmentCalendarItem;
  currentMonth: string;
  currentYear: string;
  onClose: () => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  appointment,
  currentMonth,
  currentYear,
  onClose,
}) => (
  <div className="fixed inset-0 bg-[#000000]/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
    <div className="bg-white border border-neutral-100 rounded-[20px] shadow-2xl p-6 w-100">
      <div className="flex justify-between items-center mb-4 border-b border-neutral-100 pb-3">
        <span className="text-[14px] font-bold text-[#111827] bg-[#F1F3F5] px-3 py-1 rounded-md">
          {appointment.plate}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-4 text-[14px]">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Scheduled Date</span>
          <span className="font-semibold text-gray-800">
            {currentMonth} {appointment.day}, {currentYear}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Time Slot</span>
          <span className="font-semibold text-[#111827]">{appointment.time}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Vehicle Type</span>
          <span className="font-semibold text-gray-800">{appointment.type}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Diagnostic Stage</span>
          <span className="font-semibold text-[#136E27]">{appointment.stage}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Priority Level</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              appointment.priority === 'High'
                ? 'bg-[#FFDEDE] text-[#C92A2A]'
                : 'bg-[#DEF5E5] text-[#136E27]'
            }`}
          >
            {appointment.priority}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full bg-[#111827] hover:bg-black text-white font-semibold text-[13px] py-2.5 rounded-[10px] transition-colors mt-6"
      >
        Close Details
      </button>
    </div>
  </div>
);
