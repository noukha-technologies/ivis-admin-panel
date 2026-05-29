import type { ApiPaymentTransaction } from '../../interfaces/payment-transaction.interface';
import type { PaymentTransactionListItem } from './types';

export function toPaymentTransactionListItem(
  row: ApiPaymentTransaction,
): PaymentTransactionListItem {
  return {
    id: row.id,
    displayId: `#${row.payment_transaction_id}`,
    customer: row.customer?.name ?? '—',
    vehicle: row.vehicleRecord?.plate_number ?? '—',
    total: `OMR ${Number(row.grand_total).toFixed(2)}`,
    mode: row.payment_type,
    type: row.status,
    raw: row,
  };
}
