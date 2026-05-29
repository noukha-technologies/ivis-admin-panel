import type { TransactionListParams } from './transaction-list.interface';

export interface ApiTransactionCustomer {
  id: string;
  customer_id: number;
  name: string;
  phone: string;
  owner_name?: string;
  id_number?: string;
  primary_vehicle_record_id?: string | null;
  created_at: string;
  updated_at?: string;
  primaryVehicleRecord?: {
    id: string;
    plate_number?: string;
    chassis_no?: string;
    vehicle_type?: string;
  };
}

export interface CreateTransactionCustomerPayload {
  name: string;
  phone: string;
  owner_name?: string;
  id_number?: string;
  primary_vehicle_record_id?: string;
  plate_number?: string;
  plate_color?: string;
}

export type UpdateTransactionCustomerPayload = Partial<CreateTransactionCustomerPayload>;

export type TransactionCustomerListParams = TransactionListParams;
