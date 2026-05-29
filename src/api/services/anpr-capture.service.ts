import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';
import { unwrapData, unwrapPaginated } from '../apiResponse';
import type { ApiEnvelope, PaginatedResult } from '../../types/api.types';
import type {
  ApiAnprCapture,
  AnprCaptureListParams,
  CreateAnprCapturePayload,
  UpdateAnprCapturePayload,
} from '../../interfaces/anpr-capture.interface';

export const anprCaptureService = {
  getAll: async (params?: AnprCaptureListParams): Promise<PaginatedResult<ApiAnprCapture>> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiAnprCapture[]>>(
      ENDPOINTS.ANPR_CAPTURES.BASE,
      { params },
    );
    return unwrapPaginated(response);
  },

  getById: async (id: string): Promise<ApiAnprCapture> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiAnprCapture>>(
      ENDPOINTS.ANPR_CAPTURES.BY_ID(id),
    );
    return unwrapData(response);
  },

  create: async (data: CreateAnprCapturePayload): Promise<ApiAnprCapture> => {
    const response = await axiosInstance.post<ApiEnvelope<ApiAnprCapture>>(
      ENDPOINTS.ANPR_CAPTURES.BASE,
      data,
    );
    return unwrapData(response);
  },

  update: async (id: string, data: UpdateAnprCapturePayload): Promise<ApiAnprCapture> => {
    const response = await axiosInstance.patch<ApiEnvelope<ApiAnprCapture>>(
      ENDPOINTS.ANPR_CAPTURES.BY_ID(id),
      data,
    );
    return unwrapData(response);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.ANPR_CAPTURES.BY_ID(id));
  },
};
