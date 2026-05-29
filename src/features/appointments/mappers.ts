import type { ApiAppointment } from '../../interfaces/appointment.interface';
import { formatDateShort, formatTime12h } from '../../utils/format';
import type { AppointmentCalendarItem, AppointmentListRow } from './types';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function toAppointmentCalendarItem(row: ApiAppointment): AppointmentCalendarItem {
  const d = new Date(row.appointment_at);
  const isHigh = row.status === 'Cancelled' || row.status === 'NoShow';
  return {
    id: row.id,
    plate: row.plate_number ?? '—',
    type: 'Walk-in',
    day: d.getDate(),
    month: MONTH_NAMES[d.getMonth()],
    year: String(d.getFullYear()),
    priority: isHigh ? 'High' : 'Low',
    status: row.status === 'Scheduled' || row.status === 'Completed' ? 'green' : 'red',
    time: formatTime12h(row.appointment_at),
    stage: row.status,
    raw: row,
  };
}

export function toAppointmentListRow(row: ApiAppointment, index: number): AppointmentListRow {
  return {
    id: row.id,
    seq: String(index + 1).padStart(2, '0'),
    customer: row.customer_name ?? '—',
    vehicle: row.plate_number ?? '—',
    center: row.centre?.name ?? '—',
    line: row.line?.name ?? '—',
    created: formatDateShort(row.created_at),
  };
}
