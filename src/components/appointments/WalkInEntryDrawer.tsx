import React from 'react';
import { SideDrawer } from '@/components/ui/SideDrawer';
import { cn } from '@/utils/cn';
import type { WalkInEntryDrawerProps } from '@/interfaces/appointment.interface';

const fieldClass =
  'w-full rounded-[10px] border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 outline-none focus:border-neutral-400';
const labelClass = 'mb-1.5 block text-[13px] font-semibold text-neutral-600';

export const WalkInEntryDrawer: React.FC<WalkInEntryDrawerProps> = ({
  open,
  currentMonth,
  currentYear,
  daysInMonth,
  form,
  payment,
  onOpenChange,
  onSubmit,
  onConvertToJob,
  onFormChange,
  onPaymentChange,
}) => (
  <SideDrawer
    open={open}
    onOpenChange={onOpenChange}
    size="lg"
    title="New Walk-in Entry"
    description="Register a walk-in appointment and optional payment."
    showCloseButton={false}
    footer={
      <>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="rounded-[10px] bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConvertToJob}
          className="rounded-[10px] border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-50"
        >
          Convert to Job
        </button>
        <button
          type="submit"
          form="walk-in-entry-form"
          className="rounded-[10px] border border-[#1c1c1e] bg-[#1c1c1e] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800"
        >
          Confirm Entry
        </button>
      </>
    }
  >
    <form id="walk-in-entry-form" onSubmit={onSubmit} className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_auto_1fr]">
      <div className="flex flex-col gap-3 pt-4 xl:max-h-[620px] xl:overflow-y-auto xl:pr-3">
        <h3 className="text-base font-bold text-[#111827]">Entry details</h3>

        <div>
          <label className={labelClass}>Plate Number *</label>
          <input
            type="text"
            value={form.plate}
            onChange={(e) => onFormChange('plate', e.target.value)}
            placeholder="Enter"
            required
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Appointment Day *</label>
          <select
            value={form.day}
            onChange={(e) => onFormChange('day', e.target.value)}
            className={cn(fieldClass, 'cursor-pointer appearance-none')}
          >
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
              <option key={d} value={String(d)}>
                {d} ({currentMonth} {d}, {currentYear})
              </option>
            ))}
          </select>
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
          <label className={labelClass}>Phone Number *</label>
          <input
            type="tel"
            value={form.phoneNumber}
            onChange={(e) => onFormChange('phoneNumber', e.target.value)}
            placeholder="Enter"
            required
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Vehicle Type *</label>
          <select
            value={form.type}
            onChange={(e) => onFormChange('type', e.target.value)}
            className={cn(fieldClass, 'cursor-pointer appearance-none')}
          >
            <option value="OM 0082">OM 0082</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Truck">Truck</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Vehicle No *</label>
          <select
            value={form.vehicleNo}
            onChange={(e) => onFormChange('vehicleNo', e.target.value)}
            className={cn(fieldClass, 'cursor-pointer appearance-none')}
          >
            <option value="OM 0082">OM 0082</option>
            <option value="OM-2000">OM-2000</option>
            <option value="OM-2020">OM-2020</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Chassis No</label>
          <input
            type="text"
            value={form.chassisNo}
            onChange={(e) => onFormChange('chassisNo', e.target.value)}
            placeholder="9003 30039"
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Mulkiya Id</label>
          <input
            type="text"
            value={form.mulkiyaId}
            onChange={(e) => onFormChange('mulkiyaId', e.target.value)}
            placeholder="OMN 0934"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="hidden w-px self-stretch bg-neutral-200 xl:block" />

      <div className="flex flex-col gap-3 pt-4 xl:max-h-[620px] xl:overflow-y-auto xl:pr-3">
        <h3 className="text-base font-bold text-[#111827]">Add Payment</h3>

        <div>
          <label className={labelClass}>Phone *</label>
          <input
            type="tel"
            value={payment.phone}
            onChange={(e) => onPaymentChange('phone', e.target.value)}
            placeholder="Enter"
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Amount (OMR)</label>
          <input
            type="text"
            value={payment.amount}
            onChange={(e) => onPaymentChange('amount', e.target.value)}
            placeholder="Enter"
            className={fieldClass}
          />
        </div>

        <div>
          <label className={cn(labelClass, 'mb-2')}>Type</label>
          <div className="flex items-center gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-neutral-700">
              <input
                type="radio"
                name="paymentType"
                checked={payment.type === 'Paid'}
                onChange={() => onPaymentChange('type', 'Paid')}
                className="h-4 w-4 accent-neutral-900"
              />
              Paid
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-neutral-700">
              <input
                type="radio"
                name="paymentType"
                checked={payment.type === 'FOC'}
                onChange={() => onPaymentChange('type', 'FOC')}
                className="h-4 w-4 accent-neutral-900"
              />
              FOC
            </label>
          </div>
        </div>

        <div>
          <label className={cn(labelClass, 'mb-2')}>Mode</label>
          <div className="grid grid-cols-3 gap-3">
            {(['Cash', 'UPI', 'External API'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onPaymentChange('mode', mode)}
                className={cn(
                  'rounded-xl border px-3 py-4 text-center text-[13px] transition-all',
                  payment.mode === mode
                    ? 'border-neutral-400 bg-neutral-100 font-semibold text-neutral-900'
                    : 'border-neutral-200 bg-white font-normal text-neutral-500 hover:border-neutral-300',
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  </SideDrawer>
);
