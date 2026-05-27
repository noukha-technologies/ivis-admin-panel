export interface ApiLine {
  id: string;
  line_id: number;
  name: string;
  code: string;
  display_order: number;
  description?: string;
  status: 'Active' | 'Inactive';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLinePayload {
  name: string;
  code: string;
  display_order: number;
  description?: string;
  status?: 'Active' | 'Inactive';
}

export interface UpdateLinePayload {
  name?: string;
  code?: string;
  display_order?: number;
  description?: string;
  status?: 'Active' | 'Inactive';
}

export interface LineListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  nonPaginated?: boolean;
}
