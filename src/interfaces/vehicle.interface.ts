export const VEHICLE_MASTER_STATUSES = ['Active', 'Inactive', 'Suspended'] as const;

export type VehicleMasterStatus = (typeof VEHICLE_MASTER_STATUSES)[number];

export interface ApiVehicle {
  id: string;
  vehicle_id: number;
  name: string;
  code: string;
  vin_no?: string;
  status: VehicleMasterStatus;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVehiclePayload {
  vehicle_id?: number;
  name: string;
  code: string;
  vin_no?: string;
  status?: VehicleMasterStatus;
}

export interface UpdateVehiclePayload {
  name?: string;
  code?: string;
  vin_no?: string;
  status?: VehicleMasterStatus;
}

export interface VehicleListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  nonPaginated?: boolean;
}
