import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';
import { unwrapData, unwrapPaginated } from '../apiResponse';
import type { ApiEnvelope, PaginatedResult } from '../../types/api.types';
import type {
  ApiVehicle,
  CreateVehiclePayload,
  UpdateVehiclePayload,
  VehicleListParams,
} from '../../interfaces/vehicle.interface';
import type {
  ApiTest,
  CreateTestPayload,
  UpdateTestPayload,
  TestListParams,
} from '../../interfaces/test.interface';

export type {
  ApiVehicle,
  CreateVehiclePayload,
  UpdateVehiclePayload,
  VehicleListParams,
  ApiTest,
  CreateTestPayload,
  UpdateTestPayload,
  TestListParams,
};

export const masterService = {
  vehicles: {
    getAll: async (params?: VehicleListParams): Promise<PaginatedResult<ApiVehicle>> => {
      const response = await axiosInstance.get<ApiEnvelope<ApiVehicle[]>>(
        ENDPOINTS.VEHICLES.BASE,
        { params }
      );
      return unwrapPaginated(response);
    },

    getById: async (id: string): Promise<ApiVehicle> => {
      const response = await axiosInstance.get<ApiEnvelope<ApiVehicle>>(
        ENDPOINTS.VEHICLES.BY_ID(id)
      );
      return unwrapData(response);
    },

    create: async (data: CreateVehiclePayload): Promise<ApiVehicle> => {
      const response = await axiosInstance.post<ApiEnvelope<ApiVehicle>>(
        ENDPOINTS.VEHICLES.BASE,
        data
      );
      return unwrapData(response);
    },

    update: async (id: string, data: UpdateVehiclePayload): Promise<ApiVehicle> => {
      const response = await axiosInstance.patch<ApiEnvelope<ApiVehicle>>(
        ENDPOINTS.VEHICLES.BY_ID(id),
        data
      );
      return unwrapData(response);
    },

    delete: async (id: string): Promise<void> => {
      await axiosInstance.delete(ENDPOINTS.VEHICLES.BY_ID(id));
    },
  },
  tests: {
    getAll: async (params?: TestListParams): Promise<PaginatedResult<ApiTest>> => {
      const response = await axiosInstance.get<ApiEnvelope<ApiTest[]>>(
        ENDPOINTS.TESTS.BASE,
        { params }
      );
      return unwrapPaginated(response);
    },

    getById: async (id: string): Promise<ApiTest> => {
      const response = await axiosInstance.get<ApiEnvelope<ApiTest>>(
        ENDPOINTS.TESTS.BY_ID(id)
      );
      return unwrapData(response);
    },

    create: async (data: CreateTestPayload): Promise<ApiTest> => {
      const response = await axiosInstance.post<ApiEnvelope<ApiTest>>(
        ENDPOINTS.TESTS.BASE,
        data
      );
      return unwrapData(response);
    },

    update: async (id: string, data: UpdateTestPayload): Promise<ApiTest> => {
      const response = await axiosInstance.patch<ApiEnvelope<ApiTest>>(
        ENDPOINTS.TESTS.BY_ID(id),
        data
      );
      return unwrapData(response);
    },

    delete: async (id: string): Promise<void> => {
      await axiosInstance.delete(ENDPOINTS.TESTS.BY_ID(id));
    },
  },
};
