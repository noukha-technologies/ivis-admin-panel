import type { FormEvent } from 'react';
import type { PaymentFormState } from '../features/payments/types';
import type { TransactionListParams } from './transaction-list.interface';

export interface ApiPaymentTransaction {
  id: string;
  payment_transaction_id: number;
  appointment_id?: string | null;
  customer_id: string;
  vehicle_record_id: string;
  job_id?: string | null;
  anpr_capture_id?: string | null;
  centre_id?: string | null;
  line_id?: string | null;
  admin_pc_id?: string | null;
  camera_id?: string | null;
  payment_type: string;
  status: string;
  charges: number;
  vat: number;
  grand_total: number;
  pay_date?: string | null;
  created_at: string;
  updated_at?: string;
  customer?: { id: string; name: string; phone?: string };
  vehicleRecord?: { id: string; plate_number?: string };
  appointment?: { id: string; appointment_id?: number };
}

export interface CreatePaymentTransactionPayload {
  customer_id: string;
  vehicle_record_id: string;
  payment_type: string;
  appointment_id?: string;
  anpr_capture_id?: string;
  centre_id?: string;
  line_id?: string;
  admin_pc_id?: string;
  camera_id?: string;
  status?: string;
  charges?: number;
  vat?: number;
  grand_total?: number;
  pay_date?: string;
  auto_create_job?: boolean;
  job_source?: string;
}

export type UpdatePaymentTransactionPayload = Partial<CreatePaymentTransactionPayload>;

export type PaymentTransactionListParams = TransactionListParams;

export interface PaymentTransactionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: FormEvent) => void;
  form: PaymentFormState;
  onFormChange: <K extends keyof PaymentFormState>(key: K, value: PaymentFormState[K]) => void;
  paymentModeOptions: string[];
  isSubmitting?: boolean;
}
