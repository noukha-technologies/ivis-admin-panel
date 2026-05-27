export interface ApiRole {
  id: string;
  role_id: number;
  role_name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  is_deleted?: boolean;
}

export interface CreateRolePayload {
  role_name: string;
  description?: string;
}

export interface UpdateRolePayload {
  role_name?: string;
  description?: string;
}

export interface RoleListParams {
  page?: number;
  limit?: number;
  search?: string;
}
