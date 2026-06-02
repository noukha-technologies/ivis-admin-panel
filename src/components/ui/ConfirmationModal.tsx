import React from 'react';
import { cn } from '@/utils/cn';

export type ConfirmationModalVariant = 'danger' | 'warning';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  variant?: ConfirmationModalVariant;
}

const variantStyles: Record<
  ConfirmationModalVariant,
  {
    iconBg: string;
    iconRing: string;
    iconStroke: string;
    confirmButton: string;
    defaultConfirmText: string;
  }
> = {
  danger: {
    iconBg: '#FEE4E2',
    iconRing: '#FEF3F2',
    iconStroke: '#D92D20',
    confirmButton:
      'bg-[#fee2e2] hover:bg-[#fca5a5] border border-[#f87171] text-[#dc2626]',
    defaultConfirmText: 'Yes, Delete',
  },
  warning: {
    iconBg: '#FEF0C7',
    iconRing: '#FFFAEB',
    iconStroke: '#DC6803',
    confirmButton:
      'bg-[#fef3c7] hover:bg-[#fde68a] border border-[#fbbf24] text-[#b45309]',
    defaultConfirmText: 'Yes, Suspend',
  },
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  isSubmitting = false,
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const styles = variantStyles[variant];
  const resolvedConfirmText = confirmText ?? styles.defaultConfirmText;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl w-100 p-6 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
        <div className="mb-4">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="48" height="48" rx="24" fill={styles.iconBg} />
            <rect
              x="4"
              y="4"
              width="48"
              height="48"
              rx="24"
              stroke={styles.iconRing}
              strokeWidth="8"
            />
            {variant === 'danger' ? (
              <path
                d="M28 24V28M28 32H28.01M38 28C38 33.5228 33.5228 38 28 38C22.4772 38 18 33.5228 18 28C18 22.4772 22.4772 18 28 18C33.5228 18 38 22.4772 38 28Z"
                stroke={styles.iconStroke}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M28 18L17 37H39L28 18Z M28 25V30 M28 33H28.01"
                stroke={styles.iconStroke}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </div>
        <h3 className="text-[18px] font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">{message}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-50 font-semibold text-[14px] text-slate-700 rounded-lg transition-all cursor-pointer disabled:opacity-60"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={cn(
              'flex-1 py-2.5 font-semibold text-[14px] rounded-lg transition-all cursor-pointer disabled:opacity-60',
              styles.confirmButton,
            )}
          >
            {isSubmitting ? 'Processing...' : resolvedConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
