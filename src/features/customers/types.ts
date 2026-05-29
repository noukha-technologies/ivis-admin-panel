import type { ApiTransactionCustomer } from '../../interfaces/customer-transaction.interface';

export interface CustomerListItem {
  id: string;
  name: string;
  phone: string;
  idNumber: string;
  plate: string;
  chassis: string;
  vehicle: string;
  raw: ApiTransactionCustomer;
}
