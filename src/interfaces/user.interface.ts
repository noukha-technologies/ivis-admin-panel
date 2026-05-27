export interface ApiUser {
  id: string;
  user_id: number;
  user_name: string;
  email: string;
  role: string;
  center?: string;
  line?: string;
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
  center?: string;
  line?: string;
}

export interface UpdateUserPayload {
  user_name?: string;
  email?: string;
  role_id?: number;
  center?: string;
  line?: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
}
