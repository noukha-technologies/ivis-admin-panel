import type { TransactionListParams } from './transaction-list.interface';

export type JobStatus =
  | 'Pending'
  | 'Ready'
  | 'InProgress'
  | 'Passed'
  | 'Failed'
  | 'Cancelled';

export interface ApiJob {
  id: string;
  job_id: number;
  status: JobStatus;
  source: string;
  customer_id: string;
  vehicle_record_id: string;
  anpr_capture_id?: string | null;
  centre_id?: string | null;
  line_id?: string | null;
  admin_pc_id?: string | null;
  camera_id?: string | null;
  overall_result?: string | null;
  infile_name?: string;
  infile_path?: string;
  outfile_name?: string;
  outfile_path?: string;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at?: string;
  customer?: { id: string; name: string; phone?: string; id_number?: string };
  vehicleRecord?: {
    id: string;
    plate_number?: string;
    chassis_no?: string;
    vehicle_type?: string;
    make?: string;
    model?: string;
  };
  centre?: { id: string; name: string; code?: string };
  line?: { id: string; name: string; code?: string };
  adminPc?: { id: string; name?: string; code?: string };
  camera?: { id: string; name?: string; code?: string };
  anprCapture?: { id: string; plate_number?: string };
}

export interface CreateJobPayload {
  source: string;
  customer_id: string;
  vehicle_record_id: string;
  status?: JobStatus;
  anpr_capture_id?: string;
  centre_id?: string;
  line_id?: string;
  admin_pc_id?: string;
  camera_id?: string;
}

export type UpdateJobPayload = Partial<
  Omit<CreateJobPayload, 'source' | 'customer_id' | 'vehicle_record_id'>
> & {
  overall_result?: string | null;
  infile_name?: string;
  infile_path?: string;
  outfile_name?: string;
  outfile_path?: string;
  started_at?: string;
  completed_at?: string;
};

export type JobListParams = TransactionListParams;
