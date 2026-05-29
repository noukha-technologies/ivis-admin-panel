import type { TransactionListParams } from './transaction-list.interface';

export interface ApiRopVerification {
  id: string;
  rop_verification_id: number;
  anpr_capture_id: string;
  owner_name?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  reg_no?: string;
  chassis_no?: string;
  insurance?: string;
  reg_expiry?: string;
  fetch_status: string;
  created_at: string;
  updated_at?: string;
  anpr_capture?: { id: string; plate_number?: string };
}

export interface CreateRopVerificationPayload {
  anpr_capture_id: string;
  owner_name?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  reg_no?: string;
  chassis_no?: string;
  insurance?: string;
  reg_expiry?: string;
  fetch_status?: string;
}

export type UpdateRopVerificationPayload = Partial<
  Omit<CreateRopVerificationPayload, 'anpr_capture_id'>
>;

export type RopVerificationListParams = TransactionListParams;
