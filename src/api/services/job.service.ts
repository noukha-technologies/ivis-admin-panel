import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';
import { unwrapData, unwrapPaginated } from '../apiResponse';
import type { ApiEnvelope, PaginatedResult } from '../../types/api.types';
import type {
  ApiJob,
  CreateJobPayload,
  JobListParams,
  UpdateJobPayload,
} from '../../interfaces/job.interface';

export const jobService = {
  getAll: async (params?: JobListParams): Promise<PaginatedResult<ApiJob>> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiJob[]>>(ENDPOINTS.JOBS.BASE, {
      params,
    });
    return unwrapPaginated(response);
  },

  getById: async (id: string): Promise<ApiJob> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiJob>>(ENDPOINTS.JOBS.BY_ID(id));
    return unwrapData(response);
  },

  create: async (data: CreateJobPayload): Promise<ApiJob> => {
    const response = await axiosInstance.post<ApiEnvelope<ApiJob>>(ENDPOINTS.JOBS.BASE, data);
    return unwrapData(response);
  },

  update: async (id: string, data: UpdateJobPayload): Promise<ApiJob> => {
    const response = await axiosInstance.patch<ApiEnvelope<ApiJob>>(
      ENDPOINTS.JOBS.BY_ID(id),
      data,
    );
    return unwrapData(response);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.JOBS.BY_ID(id));
  },
};
