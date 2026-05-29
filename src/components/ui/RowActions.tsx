import React from 'react';

interface ActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface RowActionsProps {
  actions: ActionItem[];
}

export const RowActions: React.FC<RowActionsProps> = ({ actions }) => {
  return (
    <div 
      className="flex items-center justify-start gap-1.5" 
      onClick={(e) => e.stopPropagation()}
    >
      {actions.map((act) => (
        <button
          key={act.id}
          onClick={act.onClick}
          title={act.label}
          className={`p-1.5 rounded-lg transition-all duration-150 flex items-center justify-center cursor-pointer ${
            act.variant === 'danger'
              ? 'text-rose-500 hover:bg-rose-50 active:bg-rose-100'
              : 'text-slate-500 hover:bg-neutral-100 active:bg-neutral-200'
          }`}
        >
          {act.icon}
        </button>
      ))}
    </div>
  );
};
