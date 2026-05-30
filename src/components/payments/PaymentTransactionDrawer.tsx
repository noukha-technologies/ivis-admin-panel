import React from 'react';
import { SideDrawer } from '@/components/ui/SideDrawer';
import { cn } from '@/utils/cn';
import type { PaymentFormType } from '@/features/payments/types';
import type { PaymentTransactionDrawerProps } from '@/interfaces/payment-transaction.interface';

const fieldClass =
  'w-full rounded-[10px] border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 outline-none focus:border-neutral-400';
const labelClass = 'mb-1.5 block text-[13px] font-semibold text-neutral-600';

const DEFAULT_MODE_OPTIONS = ['Cash', 'UPI', 'External API'] as const;

function ModeIcon({ mode }: { mode: string }) {
  if (mode === 'Cash') {
    return (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="mb-1">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M6 10h.01M18 14h.01" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (mode === 'UPI') {
    return (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="mb-1">
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 5h2M12 19v.01" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="mb-1">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h.01M11 15h2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const PaymentTransactionDrawer: React.FC<PaymentTransactionDrawerProps> = ({
  open,
  onOpenChange,
  onSubmit,
  form,
  onFormChange,
  paymentModeOptions,
  isSubmitting = false,
}) => {
  const modes = paymentModeOptions.length > 0 ? paymentModeOptions : [...DEFAULT_MODE_OPTIONS];
  const isFoc = form.paymentType === 'FOC';

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title="New Payment"
      description="Record customer payment details."
      footer={
        <>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="flex-1 rounded-[10px] border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="new-payment-form"
            disabled={isSubmitting}
            className="flex-1 rounded-[10px] border border-[#1c1c1e] bg-[#1c1c1e] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800 disabled:opacity-60"
          >
            Confirm Payment
          </button>
        </>
      }
    >
      <form id="new-payment-form" onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Phone *</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => onFormChange('phone', e.target.value)}
            placeholder="Enter"
            required
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Customer Name *</label>
          <input
            type="text"
            value={form.customerName}
            onChange={(e) => onFormChange('customerName', e.target.value)}
            placeholder="Enter"
            required
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Vehicle Number *</label>
          <input
            type="text"
            value={form.vehicleNumber}
            onChange={(e) => onFormChange('vehicleNumber', e.target.value)}
            placeholder="Enter"
            required
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Amount (OMR)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={isFoc ? '0' : form.amount}
            onChange={(e) => onFormChange('amount', e.target.value)}
            placeholder="Enter"
            disabled={isFoc}
            required={!isFoc}
            className={cn(fieldClass, isFoc && 'bg-neutral-50 text-neutral-400')}
          />
        </div>

        <div>
          <label className={cn(labelClass, 'mb-2')}>Type</label>
          <div className="flex items-center gap-6">
            {(['Paid', 'FOC'] as PaymentFormType[]).map((type) => (
              <label
                key={type}
                className="flex cursor-pointer items-center gap-2 text-sm font-medium text-neutral-700"
              >
                <input
                  type="radio"
                  name="paymentFormType"
                  checked={form.paymentType === type}
                  onChange={() => onFormChange('paymentType', type)}
                  className="h-4 w-4 accent-neutral-900"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={cn(labelClass, 'mb-2')}>Mode</label>
          <div className="grid grid-cols-3 gap-2.5">
            {modes.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onFormChange('paymentMode', mode)}
                className={cn(
                  'flex flex-col items-center justify-center rounded-[10px] border px-2 py-3 text-xs transition-all',
                  form.paymentMode === mode
                    ? 'border-neutral-300 bg-neutral-200 font-semibold text-neutral-900'
                    : 'border-neutral-200 bg-white font-medium text-neutral-600 hover:border-neutral-300',
                )}
              >
                <ModeIcon mode={mode} />
                <span className="text-center leading-tight">{mode}</span>
              </button>
            ))}
          </div>
        </div>
      </form>
    </SideDrawer>
  );
};
