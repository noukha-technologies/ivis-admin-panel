export interface ApiUser {
  id: string;
  user_id: number;
  user_name: string;
  email: string;
  role: string;
  center_id?: string | null;
  line_id?: string | null;
  assignedCentre?: { id: string; name: string; code: string };
  assignedLine?: { id: string; name: string; code: string };
  created_at: string;
  updated_at?: string;
  is_deleted?: boolean;
}

export interface CreateUserPayload {
  user_id: number;
  user_name: string;
  email: string;
  role_id: number;
  password?: string;
  center_id?: string;
  line_id?: string;
}

export interface UpdateUserPayload {
  user_name?: string;
  email?: string;
  role_id?: number;
  center_id?: string | null;
  line_id?: string | null;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
}
