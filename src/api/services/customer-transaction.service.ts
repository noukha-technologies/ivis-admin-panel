import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';
import { unwrapData, unwrapPaginated } from '../apiResponse';
import type { ApiEnvelope, PaginatedResult } from '../../types/api.types';
import type {
  ApiTransactionCustomer,
  CreateTransactionCustomerPayload,
  TransactionCustomerListParams,
  UpdateTransactionCustomerPayload,
} from '../../interfaces/customer-transaction.interface';

export const customerTransactionService = {
  getAll: async (
    params?: TransactionCustomerListParams,
  ): Promise<PaginatedResult<ApiTransactionCustomer>> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiTransactionCustomer[]>>(
      ENDPOINTS.CUSTOMERS.BASE,
      { params },
    );
    return unwrapPaginated(response);
  },

  getById: async (id: string): Promise<ApiTransactionCustomer> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiTransactionCustomer>>(
      ENDPOINTS.CUSTOMERS.BY_ID(id),
    );
    return unwrapData(response);
  },

  create: async (data: CreateTransactionCustomerPayload): Promise<ApiTransactionCustomer> => {
    const response = await axiosInstance.post<ApiEnvelope<ApiTransactionCustomer>>(
      ENDPOINTS.CUSTOMERS.BASE,
      data,
    );
    return unwrapData(response);
  },

  update: async (
    id: string,
    data: UpdateTransactionCustomerPayload,
  ): Promise<ApiTransactionCustomer> => {
    const response = await axiosInstance.patch<ApiEnvelope<ApiTransactionCustomer>>(
      ENDPOINTS.CUSTOMERS.BY_ID(id),
      data,
    );
    return unwrapData(response);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.CUSTOMERS.BY_ID(id));
  },
};
