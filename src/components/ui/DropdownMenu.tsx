import { useState, useEffect, useRef, Fragment } from 'react';
import { cn } from '../../utils/cn';
import type { DropdownMenuProps } from '../../interfaces/ui.interfaces';

export function DropdownMenu({
  trigger,
  sections,
  align = 'right',
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleItemClick = (onClick?: () => void) => {
    if (onClick) onClick();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Wrapper */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu Box */}
      {isOpen && (
        <div
          className={cn(
            "absolute mt-1.5 w-52 bg-white border border-neutral-200 rounded-xl shadow-lg py-1.5 z-50 animate-fadeInMenu text-left",
            align === 'left' ? 'left-0' : 'right-0',
            className
          )}
        >
          {sections.map((section, secIdx) => (
            <Fragment key={secIdx}>
              {/* Optional Section Header Title Label */}
              {section.label && (
                <div className="px-3.5 pt-2 pb-1 text-[11.5px] font-bold text-neutral-400 uppercase tracking-wider select-none">
                  {section.label}
                </div>
              )}

              {/* Section Items */}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.onClick)}
                    className={cn(
                      "w-full text-left px-3.5 py-2 text-[13.5px] font-semibold flex items-center justify-between cursor-pointer transition-colors",
                      item.variant === 'danger'
                        ? "text-rose-600 hover:bg-rose-50"
                        : "text-neutral-700 hover:bg-neutral-50"
                    )}
                  >
                    {/* Left: Optional icon + label */}
                    <div className="flex items-center gap-2.5">
                      {item.icon && <span className="opacity-60 text-current">{item.icon}</span>}
                      <span>{item.label}</span>
                    </div>

                    {/* Right: Checkmark for selected filter/options */}
                    {item.selected && (
                      <span className="text-current">
                        <svg className="w-4 h-4 stroke-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Render divider line between sections (but not after last section) */}
              {secIdx < sections.length - 1 && (
                <div className="h-px bg-neutral-100 my-1.5"></div>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
