export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  user_id: number;
  user_code: string;
  user_name: string;
  email: string;
  role: string;
  role_access_id?: string;
  center?: string;
  line?: string;
  center_id?: string;
  line_ids?: string[];
  lines?: { id: string; line_id: number; name: string; code: string }[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUser;
  permissions: string[];
}
