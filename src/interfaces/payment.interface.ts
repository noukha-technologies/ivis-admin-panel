export interface ApiPayment {
  id: string;
  payment_id: number;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentPayload {
  name: string;
  code: string;
  status?: 'Active' | 'Inactive';
}

export interface UpdatePaymentPayload {
  name?: string;
  code?: string;
  status?: 'Active' | 'Inactive';
}

export interface PaymentListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
