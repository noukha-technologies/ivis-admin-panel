import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { AppointmentCalendarItem } from '@/features/appointments/types';
import { MONTH_NAMES } from '@/constants/appointments';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface AppointmentsCalendarViewProps {
  currentMonth: string;
  currentYear: string;
  appointments: AppointmentCalendarItem[];
  onAppointmentClick: (appointment: AppointmentCalendarItem) => void;
}

export const AppointmentsCalendarView: React.FC<AppointmentsCalendarViewProps> = ({
  currentMonth,
  currentYear,
  appointments,
  onAppointmentClick,
}) => {
  const monthIdx = MONTH_NAMES.indexOf(currentMonth as any);
  const viewDate = new Date(parseInt(currentYear, 10), monthIdx >= 0 ? monthIdx : new Date().getMonth(), 1);

  const events = appointments.map((appt) => {
    const start = appt.raw?.appointment_at
      ? new Date(appt.raw.appointment_at)
      : new Date(parseInt(appt.year, 10), MONTH_NAMES.indexOf(appt.month as any), appt.day);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration
    return {
      id: appt.id,
      title: appt.plate,
      start,
      end,
      resource: appt,
    };
  });

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
      <div style={{ height: '700px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          date={viewDate}
          onNavigate={() => { }}
          toolbar={false}
          defaultView="month"
          views={['month']}
          formats={{
            weekdayFormat: (date, culture, localizer) =>
              localizer?.format(date, 'EEEE', culture) || '',
          }}
          onSelectEvent={(event) => onAppointmentClick(event.resource)}
          eventPropGetter={() => ({
            style: {
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0px',
              boxShadow: 'none',
            },
          })}
          components={{
            event: ({ event }) => {
              const appt = event.resource;
              const isCompleted = appt.stage === 'Completed';
              return (
                <button
                  type="button"
                  className="w-full text-center block rounded-md px-2 py-0.5 text-[11px] font-bold border transition-all cursor-pointer truncate"
                  style={{
                    backgroundColor: isCompleted ? '#343a40' : (appt.status === 'green' ? '#E6F4EA' : '#FCE8E6'),
                    borderColor: isCompleted ? '#343a40' : (appt.status === 'green' ? '#34A853' : '#EA4335'),
                    color: isCompleted ? '#ffffff' : (appt.status === 'green' ? '#137333' : '#C5221F'),
                    borderWidth: '1.5px',
                    boxSizing: 'border-box',
                  }}
                >
                  {appt.plate}
                </button>
              );
            },
          }}
        />
      </div>
    </div>
  );
};
