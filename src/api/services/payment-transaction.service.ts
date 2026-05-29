import axiosInstance from '../axios.instance';
import { ENDPOINTS } from '../endpoints';
import { unwrapData, unwrapPaginated } from '../apiResponse';
import type { ApiEnvelope, PaginatedResult } from '../../types/api.types';
import type {
  ApiPaymentTransaction,
  CreatePaymentTransactionPayload,
  PaymentTransactionListParams,
  UpdatePaymentTransactionPayload,
} from '../../interfaces/payment-transaction.interface';

export const paymentTransactionService = {
  getAll: async (
    params?: PaymentTransactionListParams,
  ): Promise<PaginatedResult<ApiPaymentTransaction>> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiPaymentTransaction[]>>(
      ENDPOINTS.PAYMENT_TRANSACTIONS.BASE,
      { params },
    );
    return unwrapPaginated(response);
  },

  getById: async (id: string): Promise<ApiPaymentTransaction> => {
    const response = await axiosInstance.get<ApiEnvelope<ApiPaymentTransaction>>(
      ENDPOINTS.PAYMENT_TRANSACTIONS.BY_ID(id),
    );
    return unwrapData(response);
  },

  create: async (data: CreatePaymentTransactionPayload): Promise<ApiPaymentTransaction> => {
    const response = await axiosInstance.post<ApiEnvelope<ApiPaymentTransaction>>(
      ENDPOINTS.PAYMENT_TRANSACTIONS.BASE,
      data,
    );
    return unwrapData(response);
  },

  update: async (
    id: string,
    data: UpdatePaymentTransactionPayload,
  ): Promise<ApiPaymentTransaction> => {
    const response = await axiosInstance.patch<ApiEnvelope<ApiPaymentTransaction>>(
      ENDPOINTS.PAYMENT_TRANSACTIONS.BY_ID(id),
      data,
    );
    return unwrapData(response);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.PAYMENT_TRANSACTIONS.BY_ID(id));
  },
};
