import React, { useState } from 'react';
import { toast } from 'sonner';
import type { JobDetailView } from '../../features/jobs/types';

interface JobPaymentFormProps {
  job: JobDetailView;
  invoiceId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const JobPaymentForm: React.FC<JobPaymentFormProps> = ({
  job,
  invoiceId,
  onCancel,
  onSuccess,
}) => {
  const [payType, setPayType] = useState<'Paid' | 'FOC'>('Paid');
  const [payMode, setPayMode] = useState<'Cash' | 'UPI' | 'Card'>('Cash');

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 w-full flex flex-col gap-6 text-left">
      {/* Form grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">Job ID (fetch job)</label>
          <input
            type="text"
            readOnly
            value={job.displayId || ''}
            placeholder="Enter"
            className="w-full bg-gray-50 border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-semibold cursor-default focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">Invoice ID</label>
          <input
            type="text"
            readOnly
            value={invoiceId || ''}
            placeholder="Enter"
            className="w-full bg-gray-50 border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-semibold cursor-default focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">Vehicle Number(fetch job)*</label>
          <input
            type="text"
            readOnly
            value={job.vehicle || ''}
            placeholder="Enter"
            className="w-full bg-gray-50 border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-semibold cursor-default focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">Customer Name(fetch job)*</label>
          <input
            type="text"
            readOnly
            value={job.customer || ''}
            placeholder="Enter"
            className="w-full bg-gray-50 border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-semibold cursor-default focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">Vehicle Type (fetch job) *</label>
          <input
            type="text"
            readOnly
            value={job.raw?.vehicleRecord?.vehicle_type || 'Sedan'}
            placeholder="Enter"
            className="w-full bg-gray-50 border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-semibold cursor-default focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">Vehicle Category / Invoice Category(fetch from master)*</label>
          <input
            type="text"
            readOnly
            value="Private Sedan"
            placeholder="Enter"
            className="w-full bg-gray-50 border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-semibold cursor-default focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">Amount (OMR inc. vat)</label>
          <input
            type="text"
            readOnly
            value="31.500"
            placeholder="Enter"
            className="w-full bg-gray-50 border border-[#D0D5DD] rounded-lg px-3.5 py-2.5 text-sm text-gray-900 font-semibold cursor-default focus:outline-none"
          />
        </div>
      </div>

      {/* Selection row: Type and Mode */}
      <div className="grid grid-cols-2 gap-6 items-start mt-2">
        {/* Type radio buttons */}
        <div>
          <span className="block text-xs font-bold text-gray-500 mb-2.5">Type</span>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm text-gray-700">
              <input
                type="radio"
                name="payType"
                checked={payType === 'Paid'}
                onChange={() => setPayType('Paid')}
                className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900 cursor-pointer"
              />
              <span>Paid</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm text-gray-700">
              <input
                type="radio"
                name="payType"
                checked={payType === 'FOC'}
                onChange={() => setPayType('FOC')}
                className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900 cursor-pointer"
              />
              <span>FOC</span>
            </label>
          </div>
        </div>

        {/* Mode cards */}
        <div>
          <span className="block text-xs font-bold text-gray-500 mb-2.5">Mode</span>
          <div className="flex items-center gap-3">
            {/* Cash */}
            <button
              type="button"
              onClick={() => setPayMode('Cash')}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all cursor-pointer ${
                payMode === 'Cash'
                  ? 'border-[#4B5563] bg-[#F3F4F6] text-gray-900 font-semibold'
                  : 'border-[#E5E7EB] bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="text-[13px]">Cash</span>
            </button>

            {/* UPI */}
            <button
              type="button"
              onClick={() => setPayMode('UPI')}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all cursor-pointer ${
                payMode === 'UPI'
                  ? 'border-[#4B5563] bg-[#F3F4F6] text-gray-900 font-semibold'
                  : 'border-[#E5E7EB] bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-[13px]">UPI</span>
            </button>

            {/* Card */}
            <button
              type="button"
              onClick={() => setPayMode('Card')}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all cursor-pointer ${
                payMode === 'Card'
                  ? 'border-[#4B5563] bg-[#F3F4F6] text-gray-900 font-semibold'
                  : 'border-[#E5E7EB] bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 10h18" />
              </svg>
              <span className="text-[13px]">Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="bg-[#F9FAFB] border border-gray-200 rounded-xl p-4 flex justify-end gap-3 w-full mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onSuccess();
            toast.success('Payment confirmed successfully!');
          }}
          className="px-6 py-2.5 bg-[#000000] text-white hover:bg-gray-800 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm"
        >
          Confirm Payment & Proceed to job
        </button>
      </div>
    </div>
  );
};
