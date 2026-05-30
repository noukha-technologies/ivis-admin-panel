import type { ApiPaymentTransaction } from '../../interfaces/payment-transaction.interface';
import type { PaymentTransactionListItem } from './types';

function resolveDisplayType(row: ApiPaymentTransaction): string {
  if (row.status === 'Paid' && Number(row.grand_total) === 0) {
    return 'FOC';
  }
  return row.status;
}

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
    type: resolveDisplayType(row),
    raw: row,
  };
}
