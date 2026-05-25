import type { AxiosResponse } from 'axios';
import type { ApiEnvelope, PaginationMeta, PaginatedResult } from '../types/api.types';

export function unwrapData<T>(response: AxiosResponse<ApiEnvelope<T>>): T {
  return response.data.data;
}

export function unwrapPaginated<T>(
  response: AxiosResponse<ApiEnvelope<T[]>>
): PaginatedResult<T> {
  const body = response.data;
  const meta: PaginationMeta = body.meta ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };
  return {
    data: body.data ?? [],
    meta,
  };
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response
  ) {
    const data = (error.response as { data?: { message?: string | string[] } }).data;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(', ') : data.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
