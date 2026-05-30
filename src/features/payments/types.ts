import type { ApiPaymentTransaction } from '../../interfaces/payment-transaction.interface';

export interface PaymentTransactionListItem {
  id: string;
  displayId: string;
  customer: string;
  vehicle: string;
  total: string;
  mode: string;
  type: string;
  raw: ApiPaymentTransaction;
}

export type PaymentFormType = 'Paid' | 'FOC';

export interface PaymentFormState {
  phone: string;
  customerName: string;
  vehicleNumber: string;
  amount: string;
  paymentType: PaymentFormType;
  paymentMode: string;
}

export const emptyPaymentForm = (): PaymentFormState => ({
  phone: '',
  customerName: '',
  vehicleNumber: '',
  amount: '',
  paymentType: 'Paid',
  paymentMode: 'Cash',
});
