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
