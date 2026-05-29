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


export interface WalkInFormState {
  plate: string;
  customerName: string;
  phoneNumber: string;
  type: string;
  vehicleNo: string;
  chassisNo: string;
  mulkiyaId: string;
  day: string;
}

export interface WalkInPaymentState {
  phone: string;
  amount: string;
  type: 'Paid' | 'FOC';
  mode: 'Cash' | 'UPI' | 'External API';
}

export interface WalkInEntryDrawerProps {
  open: boolean;
  currentMonth: string;
  currentYear: string;
  daysInMonth: number;
  form: WalkInFormState;
  payment: WalkInPaymentState;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onConvertToJob: () => void;
  onFormChange: <K extends keyof WalkInFormState>(key: K, value: WalkInFormState[K]) => void;
  onPaymentChange: <K extends keyof WalkInPaymentState>(key: K, value: WalkInPaymentState[K]) => void;
}