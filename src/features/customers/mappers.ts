import type { ApiTransactionCustomer } from '../../interfaces/customer-transaction.interface';
import type { CustomerListItem } from './types';

export function toCustomerListItem(row: ApiTransactionCustomer): CustomerListItem {
  const vr = row.primaryVehicleRecord;
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    idNumber: row.id_number ?? '—',
    plate: vr?.plate_number ?? '—',
    chassis: vr?.chassis_no ?? '—',
    vehicle: vr?.vehicle_type ?? '—',
    raw: row,
  };
}
