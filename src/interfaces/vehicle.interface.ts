export interface ApiVehicle {
  id: string;
  vehicle_id: number;
  plate_number: string;
  vehicle_type: string;
  vehicle_color: string;
  vehicle_brand: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVehiclePayload {
  vehicle_id?: number;
  plate_number: string;
  vehicle_type: string;
  vehicle_color: string;
  vehicle_brand: string;
}

export interface UpdateVehiclePayload {
  plate_number?: string;
  vehicle_type?: string;
  vehicle_color?: string;
  vehicle_brand?: string;
}

export interface VehicleListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  nonPaginated?: boolean;
}
