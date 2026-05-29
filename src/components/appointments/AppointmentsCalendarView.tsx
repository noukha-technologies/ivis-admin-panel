import React from 'react';
import type { AppointmentCalendarItem } from '@/features/appointments/types';
import { WEEKDAYS } from '@/constants/appointments';
import type { CalendarGridCell } from '@/utils/calendarGrid';

interface AppointmentsCalendarViewProps {
  gridCells: CalendarGridCell[];
  currentMonth: string;
  currentYear: string;
  appointments: AppointmentCalendarItem[];
  onAppointmentClick: (appointment: AppointmentCalendarItem) => void;
}

export const AppointmentsCalendarView: React.FC<AppointmentsCalendarViewProps> = ({
  gridCells,
  currentMonth,
  currentYear,
  appointments,
  onAppointmentClick,
}) => {
  const getAppointmentsForDay = (day: number) =>
    appointments.filter(
      (appt) => appt.day === day && appt.month === currentMonth && appt.year === currentYear,
    );

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-7 border-b border-neutral-200 bg-white">
        {WEEKDAYS.map((day, idx) => (
          <div
            key={day}
            className="text-center py-3.5 text-[13px] font-semibold text-gray-500"
            style={{ borderRight: idx === 6 ? 'none' : '1px solid #e5e7eb' }}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 bg-white">
        {gridCells.map((cell, idx) => {
          const dayAppts = cell.dayNum ? getAppointmentsForDay(cell.dayNum) : [];
          const isLastCol = (idx + 1) % 7 === 0;
          const isLastRow = idx >= 35;
          const isSaturday8 = cell.dayNum === 8 && currentMonth === 'Mar' && currentYear === '2025';

          return (
            <div
              key={idx}
              style={{
                minHeight: '110px',
                backgroundColor: isSaturday8 ? '#EAEAEC' : dayAppts.length > 0 ? '#fafafa' : '#ffffff',
                borderRight: isLastCol ? 'none' : '1px solid #e5e7eb',
                borderBottom: isLastRow ? 'none' : '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                padding: '12px 14px',
                position: 'relative',
              }}
            >
              {cell.dayNum && (
                <div className="flex justify-between items-center w-full">
                  <span className="text-[13px] font-semibold text-gray-800">{cell.dayNum}</span>
                  {dayAppts.length > 0 && (
                    <span
                      className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                      style={{ backgroundColor: '#1C2434', color: '#ffffff', fontWeight: 'bold' }}
                    >
                      {dayAppts.length}
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-1.5 mt-2.5 w-full">
                {cell.dayNum &&
                  dayAppts.map((appt) => (
                    <button
                      key={appt.id}
                      type="button"
                      onClick={() => onAppointmentClick(appt)}
                      className="w-full text-center block rounded-md px-2 py-1 text-[11px] font-bold border transition-all cursor-pointer"
                      style={{
                        backgroundColor: appt.status === 'green' ? '#E6F4EA' : '#FCE8E6',
                        borderColor: appt.status === 'green' ? '#34A853' : '#EA4335',
                        color: appt.status === 'green' ? '#137333' : '#C5221F',
                        borderWidth: '1.5px',
                        boxSizing: 'border-box',
                      }}
                    >
                      {appt.plate}
                    </button>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
