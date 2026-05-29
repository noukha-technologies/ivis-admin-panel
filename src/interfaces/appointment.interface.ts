import type { TransactionListParams } from './transaction-list.interface';

export interface ApiAppointment {
  id: string;
  appointment_id: number;
  anpr_capture_id?: string | null;
  customer_id?: string | null;
  vehicle_record_id?: string | null;
  centre_id?: string | null;
  line_id?: string | null;
  plate_number?: string;
  customer_name?: string;
  customer_phone?: string;
  id_number?: string;
  appointment_at: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  centre?: { id: string; name: string; code?: string };
  line?: { id: string; name: string; code?: string };
  anprCapture?: { id: string; plate_number?: string };
}

export interface CreateAppointmentPayload {
  customer_name: string;
  customer_phone: string;
  appointment_at: string;
  anpr_capture_id?: string;
  customer_id?: string;
  vehicle_record_id?: string;
  centre_id?: string;
  line_id?: string;
  plate_number?: string;
  id_number?: string;
  status?: string;
  sync_customer?: boolean;
  notes?: string;
}

export type UpdateAppointmentPayload = Partial<CreateAppointmentPayload>;

export type AppointmentListParams = TransactionListParams;
