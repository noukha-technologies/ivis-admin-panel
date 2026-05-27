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
import type {
  ApiCentre,
  CreateCentrePayload,
  UpdateCentrePayload,
  CentreListParams,
} from '../../interfaces/centre.interface';
import type {
  ApiLine,
  CreateLinePayload,
  UpdateLinePayload,
  LineListParams,
} from '../../interfaces/line.interface';
import type {
  ApiAdminPc,
  CreateAdminPcPayload,
  UpdateAdminPcPayload,
  AdminPcListParams,
} from '../../interfaces/admin-pc.interface';
import type {
  ApiCamera,
  CreateCameraPayload,
  UpdateCameraPayload,
  CameraListParams,
} from '../../interfaces/camera.interface';
import type {
  ApiPayment,
  CreatePaymentPayload,
  UpdatePaymentPayload,
  PaymentListParams,
} from '../../interfaces/payment.interface';

export type {
  ApiVehicle,
  CreateVehiclePayload,
  UpdateVehiclePayload,
  VehicleListParams,
  ApiTest,
  CreateTestPayload,
  UpdateTestPayload,
  TestListParams,
  ApiCentre,
  CreateCentrePayload,
  UpdateCentrePayload,
  CentreListParams,
  ApiLine,
  CreateLinePayload,
  UpdateLinePayload,
  LineListParams,
  ApiAdminPc,
  CreateAdminPcPayload,
  UpdateAdminPcPayload,
  AdminPcListParams,
  ApiCamera,
  CreateCameraPayload,
  UpdateCameraPayload,
  CameraListParams,
  ApiPayment,
  CreatePaymentPayload,
  UpdatePaymentPayload,
  PaymentListParams,
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
  centres: {
    getAll: async (params?: CentreListParams): Promise<PaginatedResult<ApiCentre>> => {
      const response = await axiosInstance.get<ApiEnvelope<ApiCentre[]>>(
        ENDPOINTS.CENTRES.BASE,
        { params }
      );
      return unwrapPaginated(response);
    },

    getById: async (id: string): Promise<ApiCentre> => {
      const response = await axiosInstance.get<ApiEnvelope<ApiCentre>>(
        ENDPOINTS.CENTRES.BY_ID(id)
      );
      return unwrapData(response);
    },

    create: async (data: CreateCentrePayload): Promise<ApiCentre> => {
      const response = await axiosInstance.post<ApiEnvelope<ApiCentre>>(
        ENDPOINTS.CENTRES.BASE,
        data
      );
      return unwrapData(response);
    },

    update: async (id: string, data: UpdateCentrePayload): Promise<ApiCentre> => {
      const response = await axiosInstance.patch<ApiEnvelope<ApiCentre>>(
        ENDPOINTS.CENTRES.BY_ID(id),
        data
      );
      return unwrapData(response);
    },

    delete: async (id: string): Promise<void> => {
      await axiosInstance.delete(ENDPOINTS.CENTRES.BY_ID(id));
    },
  },
  lines: {
    getAll: async (params?: LineListParams): Promise<PaginatedResult<ApiLine>> => {
      const response = await axiosInstance.get<ApiEnvelope<ApiLine[]>>(
        ENDPOINTS.LINES.BASE,
        { params }
      );
      return unwrapPaginated(response);
    },

    getById: async (id: string): Promise<ApiLine> => {
      const response = await axiosInstance.get<ApiEnvelope<ApiLine>>(
        ENDPOINTS.LINES.BY_ID(id)
      );
      return unwrapData(response);
    },

    create: async (data: CreateLinePayload): Promise<ApiLine> => {
      const response = await axiosInstance.post<ApiEnvelope<ApiLine>>(
        ENDPOINTS.LINES.BASE,
        data
      );
      return unwrapData(response);
    },

    update: async (id: string, data: UpdateLinePayload): Promise<ApiLine> => {
      const response = await axiosInstance.patch<ApiEnvelope<ApiLine>>(
        ENDPOINTS.LINES.BY_ID(id),
        data
      );
      return unwrapData(response);
    },

    delete: async (id: string): Promise<void> => {
      await axiosInstance.delete(ENDPOINTS.LINES.BY_ID(id));
    },
  },
  pcs: {
    getAll: async (params?: AdminPcListParams): Promise<PaginatedResult<ApiAdminPc>> => {
      const response = await axiosInstance.get<ApiEnvelope<ApiAdminPc[]>>(
        ENDPOINTS.ADMIN_PCS.BASE,
        { params }
      );
      return unwrapPaginated(response);
    },

    getById: async (id: string): Promise<ApiAdminPc> => {
      const response = await axiosInstance.get<ApiEnvelope<ApiAdminPc>>(
        ENDPOINTS.ADMIN_PCS.BY_ID(id)
      );
      return unwrapData(response);
    },

    create: async (data: CreateAdminPcPayload): Promise<ApiAdminPc> => {
      const response = await axiosInstance.post<ApiEnvelope<ApiAdminPc>>(
        ENDPOINTS.ADMIN_PCS.BASE,
        data
      );
      return unwrapData(response);
    },

    update: async (id: string, data: UpdateAdminPcPayload): Promise<ApiAdminPc> => {
      const response = await axiosInstance.patch<ApiEnvelope<ApiAdminPc>>(
        ENDPOINTS.ADMIN_PCS.BY_ID(id),
        data
      );
      return unwrapData(response);
    },

    delete: async (id: string): Promise<void> => {
      await axiosInstance.delete(ENDPOINTS.ADMIN_PCS.BY_ID(id));
    },
  },
  cameras: {
    getAll: async (params?: CameraListParams): Promise<PaginatedResult<ApiCamera>> => {
      const response = await axiosInstance.get<ApiEnvelope<ApiCamera[]>>(
        ENDPOINTS.CAMERAS.BASE,
        { params }
      );
      return unwrapPaginated(response);
    },

    getById: async (id: string): Promise<ApiCamera> => {
      const response = await axiosInstance.get<ApiEnvelope<ApiCamera>>(
        ENDPOINTS.CAMERAS.BY_ID(id)
      );
      return unwrapData(response);
    },

    create: async (data: CreateCameraPayload): Promise<ApiCamera> => {
      const response = await axiosInstance.post<ApiEnvelope<ApiCamera>>(
        ENDPOINTS.CAMERAS.BASE,
        data
      );
      return unwrapData(response);
    },

    update: async (id: string, data: UpdateCameraPayload): Promise<ApiCamera> => {
      const response = await axiosInstance.patch<ApiEnvelope<ApiCamera>>(
        ENDPOINTS.CAMERAS.BY_ID(id),
        data
      );
      return unwrapData(response);
    },

    delete: async (id: string): Promise<void> => {
      await axiosInstance.delete(ENDPOINTS.CAMERAS.BY_ID(id));
    },
  },
  payments: {
    getAll: async (params?: PaymentListParams): Promise<PaginatedResult<ApiPayment>> => {
      const response = await axiosInstance.get<ApiEnvelope<ApiPayment[]>>(
        ENDPOINTS.PAYMENTS.BASE,
        { params }
      );
      return unwrapPaginated(response);
    },

    getById: async (id: string): Promise<ApiPayment> => {
      const response = await axiosInstance.get<ApiEnvelope<ApiPayment>>(
        ENDPOINTS.PAYMENTS.BY_ID(id)
      );
      return unwrapData(response);
    },

    create: async (data: CreatePaymentPayload): Promise<ApiPayment> => {
      const response = await axiosInstance.post<ApiEnvelope<ApiPayment>>(
        ENDPOINTS.PAYMENTS.BASE,
        data
      );
      return unwrapData(response);
    },

    update: async (id: string, data: UpdatePaymentPayload): Promise<ApiPayment> => {
      const response = await axiosInstance.patch<ApiEnvelope<ApiPayment>>(
        ENDPOINTS.PAYMENTS.BY_ID(id),
        data
      );
      return unwrapData(response);
    },

    delete: async (id: string): Promise<void> => {
      await axiosInstance.delete(ENDPOINTS.PAYMENTS.BY_ID(id));
    },
  },
};
