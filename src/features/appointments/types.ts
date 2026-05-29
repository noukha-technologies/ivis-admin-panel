import type { ApiAppointment } from '../../interfaces/appointment.interface';

export interface AppointmentCalendarItem {
  id: string;
  plate: string;
  type: string;
  day: number;
  month: string;
  year: string;
  priority: 'High' | 'Low';
  status: 'green' | 'red';
  time: string;
  stage: string;
  raw: ApiAppointment;
}

export interface AppointmentListRow {
  seq: string;
  customer: string;
  vehicle: string;
  center: string;
  line: string;
  created: string;
  id: string;
}
