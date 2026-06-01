export interface UserLineSummary {
  id: string;
  line_id: number;
  name: string;
  code: string;
}

export interface ApiUser {
  id: string;
  user_id: number;
  user_name: string;
  email: string;
  role_access_id: string;
  roleAccess?: { id: string; role_name: string };
  center_id?: string | null;
  line_ids?: string[];
  lines?: UserLineSummary[];
  assignedCentre?: { id: string; name: string; code: string };
  created_at: string;
  updated_at?: string;
  is_deleted?: boolean;
}

export interface CreateUserPayload {
  user_id: number;
  user_name: string;
  email: string;
  role_access_id: string;
  password?: string;
  center_id?: string;
  line_ids?: string[];
}

export interface UpdateUserPayload {
  user_name?: string;
  email?: string;
  role_access_id?: string;
  center_id?: string | null;
  line_ids?: string[] | null;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
}
