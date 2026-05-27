import type { ApiLine } from './line.interface';

export interface ApiCamera {
  id: string;
  camera_id: number;
  name: string;
  code: string;
  type: string;
  line_id: string;
  line?: ApiLine;
  description?: string;
  status: 'Active' | 'Inactive';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCameraPayload {
  name: string;
  code: string;
  type: string;
  line_id: string;
  description?: string;
  status?: 'Active' | 'Inactive';
}

export interface UpdateCameraPayload {
  name?: string;
  code?: string;
  type?: string;
  line_id?: string;
  description?: string;
  status?: 'Active' | 'Inactive';
}

export interface CameraListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
