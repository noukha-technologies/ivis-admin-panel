export interface ApiCentre {
  id: string;
  centre_id: number;
  name: string;
  code: string;
  description?: string;
  status: 'Active' | 'Inactive';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCentrePayload {
  name: string;
  code: string;
  description?: string;
  status?: 'Active' | 'Inactive';
}

export interface UpdateCentrePayload {
  name?: string;
  code?: string;
  description?: string;
  status?: 'Active' | 'Inactive';
}

export interface CentreListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  nonPaginated?: boolean;
}
