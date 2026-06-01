import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yes, Delete',
  cancelText = 'Cancel',
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl w-100 p-6 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
        <div className="mb-4">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="48" height="48" rx="24" fill="#FEE4E2" style={{ fill: '#FEE4E2', fillOpacity: 1 }} />
            <rect x="4" y="4" width="48" height="48" rx="24" stroke="#FEF3F2" style={{ stroke: '#FEF3F2', strokeOpacity: 1 }} strokeWidth="8" />
            <path d="M28 24V28M28 32H28.01M38 28C38 33.5228 33.5228 38 28 38C22.4772 38 18 33.5228 18 28C18 22.4772 22.4772 18 28 18C33.5228 18 38 22.4772 38 28Z" stroke="#D92D20" style={{ stroke: '#D92D20', strokeOpacity: 1 }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-[18px] font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-50 font-semibold text-[14px] text-slate-700 rounded-lg transition-all cursor-pointer disabled:opacity-60"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-[#fee2e2] hover:bg-[#fca5a5] border border-[#f87171] text-[#dc2626] font-semibold text-[14px] rounded-lg transition-all cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
