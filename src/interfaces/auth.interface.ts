export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  user_id: number;
  user_name: string;
  email: string;
  role: string;
  center?: string;
  line?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUser;
}
