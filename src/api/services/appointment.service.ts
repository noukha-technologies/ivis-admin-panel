import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';
import { unwrapData, unwrapPaginated } from '../apiResponse';
import type { ApiEnvelope, PaginatedResult } from '../../types/api.types';
import type {
  ApiAppointment,
  AppointmentListParams,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from '../../interfaces/appointment.interface';

export const appointmentService = {
  getAll: async (params?: AppointmentListParams): Promise<PaginatedResult<ApiAppointment>> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiAppointment[]>>(
      ENDPOINTS.APPOINTMENTS.BASE,
      { params },
    );
    return unwrapPaginated(response);
  },

  getById: async (id: string): Promise<ApiAppointment> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiAppointment>>(
      ENDPOINTS.APPOINTMENTS.BY_ID(id),
    );
    return unwrapData(response);
  },

  create: async (data: CreateAppointmentPayload): Promise<ApiAppointment> => {
    const response = await axiosInstance.post<ApiEnvelope<ApiAppointment>>(
      ENDPOINTS.APPOINTMENTS.BASE,
      data,
    );
    return unwrapData(response);
  },

  update: async (id: string, data: UpdateAppointmentPayload): Promise<ApiAppointment> => {
    const response = await axiosInstance.patch<ApiEnvelope<ApiAppointment>>(
      ENDPOINTS.APPOINTMENTS.BY_ID(id),
      data,
    );
    return unwrapData(response);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.APPOINTMENTS.BY_ID(id));
  },
};
