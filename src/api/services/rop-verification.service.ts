import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';
import { unwrapData, unwrapPaginated } from '../apiResponse';
import type { ApiEnvelope, PaginatedResult } from '../../types/api.types';
import type {
  ApiRopVerification,
  CreateRopVerificationPayload,
  RopVerificationListParams,
  UpdateRopVerificationPayload,
} from '../../interfaces/rop-verification.interface';

export const ropVerificationService = {
  getAll: async (params?: RopVerificationListParams): Promise<PaginatedResult<ApiRopVerification>> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiRopVerification[]>>(
      ENDPOINTS.ROP_VERIFICATIONS.BASE,
      { params },
    );
    return unwrapPaginated(response);
  },

  getById: async (id: string): Promise<ApiRopVerification> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiRopVerification>>(
      ENDPOINTS.ROP_VERIFICATIONS.BY_ID(id),
    );
    return unwrapData(response);
  },

  create: async (data: CreateRopVerificationPayload): Promise<ApiRopVerification> => {
    const response = await axiosInstance.post<ApiEnvelope<ApiRopVerification>>(
      ENDPOINTS.ROP_VERIFICATIONS.BASE,
      data,
    );
    return unwrapData(response);
  },

  update: async (id: string, data: UpdateRopVerificationPayload): Promise<ApiRopVerification> => {
    const response = await axiosInstance.patch<ApiEnvelope<ApiRopVerification>>(
      ENDPOINTS.ROP_VERIFICATIONS.BY_ID(id),
      data,
    );
    return unwrapData(response);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.ROP_VERIFICATIONS.BY_ID(id));
  },
};
