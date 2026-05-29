import type { TransactionListParams } from './transaction-list.interface';

export interface ApiAnprCapture {
  id: string;
  anpr_capture_id: number;
  plate_number: string;
  normalized_plate?: string;
  plate_confidence?: number;
  capture_time: string;
  camera_id: string;
  lane?: string;
  direction?: string;
  country_code?: string;
  plate_color?: string;
  vehicle_type?: string;
  vehicle_color?: string;
  verification_status: string;
  created_at: string;
  updated_at?: string;
  camera?: { id: string; name?: string; code?: string };
}

export interface CreateAnprCapturePayload {
  plate_number: string;
  capture_time: string;
  camera_id: string;
  normalized_plate?: string;
  plate_confidence?: number;
  lane?: string;
  direction?: string;
  country_code?: string;
  plate_color?: string;
  vehicle_type?: string;
  vehicle_color?: string;
  verification_status?: string;
  simulate_rop?: boolean;
}

export type UpdateAnprCapturePayload = Partial<CreateAnprCapturePayload>;

export type AnprCaptureListParams = TransactionListParams;
