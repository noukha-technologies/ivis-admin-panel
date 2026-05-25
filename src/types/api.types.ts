/**
 * Global API types — aligned with IVIS-Backend ResponseInterceptor
 */

export interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  method: string;
  path: string;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  error?: string;
  path?: string;
  timestamp?: string;
}
