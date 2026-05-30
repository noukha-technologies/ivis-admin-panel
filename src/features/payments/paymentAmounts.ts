export interface PaymentAmountBreakdown {
  charges: number;
  vat: number;
  grandTotal: number;
}

/** Split grand total into charges + 5% VAT. */
export function computePaymentAmounts(grandTotal: number): PaymentAmountBreakdown {
  if (grandTotal <= 0) {
    return { charges: 0, vat: 0, grandTotal: 0 };
  }
  const charges = Math.round((grandTotal / 1.05) * 100) / 100;
  const vat = Math.round((grandTotal - charges) * 100) / 100;
  return { charges, vat, grandTotal };
}
