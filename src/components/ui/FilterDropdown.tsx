import { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '../../utils/cn';
import type { FilterDropdownProps } from '../../interfaces/ui.interfaces';

export function FilterDropdown({
  fields,
  onChange,
  align = 'left',
  className,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Local state to store active filters before applying
  const [localValues, setLocalValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach(field => {
      initial[field.id] = field.value || [];
    });
    return initial;
  });

  // Sync external field values when dropdown opens or fields change
  useEffect(() => {
    if (isOpen) {
      const currentValues: Record<string, any> = {};
      fields.forEach(field => {
        currentValues[field.id] = field.value || [];
      });
      setLocalValues(currentValues);
    }
  }, [isOpen, fields]);

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

  const handleSelectRadio = (fieldId: string, value: string) => {
    setLocalValues(prev => ({
      ...prev,
      [fieldId]: value === 'All' ? [] : [value],
    }));
  };

  const handleToggleCheckbox = (fieldId: string, value: string) => {
    setLocalValues(prev => {
      const current = prev[fieldId] || [];
      const next = current.includes(value)
        ? current.filter((v: string) => v !== value)
        : [...current, value];
      return {
        ...prev,
        [fieldId]: next,
      };
    });
  };

  const handleApply = () => {
    onChange(localValues);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const cleared: Record<string, any> = {};
    fields.forEach(field => {
      cleared[field.id] = [];
    });
    setLocalValues(cleared);
    onChange(cleared);
    setIsOpen(false);
  };

  const hasActiveFilters = useMemo(() => {
    return Object.values(localValues).some(val => Array.isArray(val) && val.length > 0);
  }, [localValues]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button - Match Mockup */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center px-4 py-2 bg-white border border-[#cbd5e1] hover:bg-neutral-50 shadow-sm rounded-xl text-[13.5px] font-bold text-[#1f2937] transition-all cursor-pointer",
          isOpen ? "border-neutral-800 bg-neutral-50" : ""
        )}
      >
        {/* Funnel Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-slate-700 mr-2">
          <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
        </svg>
        <span>Filter</span>
        {hasActiveFilters && (
          <span className="w-2.5 h-2.5 bg-neutral-900 rounded-full ml-1.5 border border-white"></span>
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div
          className={cn(
            "absolute mt-2 w-70 bg-white border border-neutral-200 rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.03)] p-6 z-50 overflow-hidden font-sans select-none animate-fadeInMenu",
            align === 'left' ? 'left-0' : 'right-0',
            className
          )}
        >
          <h3 className="text-[19px] font-bold text-[#101828] mb-5">Filter</h3>

          <div className="space-y-4">
            {fields.map((field, fieldIdx) => {
              const isRadioSection = field.selectType === 'single' || field.id === 'status' || field.id === 'mode';
              const selectedOpts = localValues[field.id] || [];

              return (
                <div key={field.id}>
                  {fieldIdx > 0 && <div className="h-px bg-neutral-100 my-4"></div>}

                  <h4 className="text-[11px] font-bold tracking-[0.12em] text-[#98a2b3] uppercase mb-3.5">
                    {field.label}
                  </h4>

                  <div className="space-y-3">
                    {/* Render Radio Buttons for Single-Select Section */}
                    {isRadioSection ? (
                      <>
                        {/* Prepend All option */}
                        <label className="flex items-center gap-3.5 cursor-pointer group">
                          <input
                            type="radio"
                            name={field.id}
                            checked={selectedOpts.length === 0}
                            onChange={() => handleSelectRadio(field.id, 'All')}
                            className="sr-only"
                          />
                          <div className={cn(
                            "w-4.5 h-4.5 rounded-full border border-neutral-300 flex items-center justify-center transition-all group-hover:border-neutral-400 bg-white",
                            selectedOpts.length === 0 ? "border-[#101828] border-[1.5px]" : ""
                          )}>
                            {selectedOpts.length === 0 && (
                              <div className="w-2 h-2 rounded-full bg-[#101828]"></div>
                            )}
                          </div>
                          <span className="text-[13.5px] font-semibold text-[#1e293b] group-hover:text-[#101828] transition-colors">
                            All
                          </span>
                        </label>

                        {field.options?.map((opt) => {
                          const isSelected = selectedOpts.includes(opt.value);
                          return (
                            <label key={opt.value} className="flex items-center gap-3.5 cursor-pointer group">
                              <input
                                type="radio"
                                name={field.id}
                                checked={isSelected}
                                onChange={() => handleSelectRadio(field.id, opt.value)}
                                className="sr-only"
                              />
                              <div className={cn(
                                "w-4.5 h-4.5 rounded-full border border-neutral-300 flex items-center justify-center transition-all group-hover:border-neutral-400 bg-white",
                                isSelected ? "border-[#101828] border-[1.5px]" : ""
                              )}>
                                {isSelected && (
                                  <div className="w-2 h-2 rounded-full bg-[#101828]"></div>
                                )}
                              </div>
                              <span className="text-[13.5px] font-semibold text-[#1e293b] group-hover:text-[#101828] transition-colors">
                                {opt.label}
                              </span>
                            </label>
                          );
                        })}
                      </>
                    ) : (
                      /* Render Checkboxes for Multi-Select Sections */
                      field.options?.map((opt) => {
                        const isSelected = selectedOpts.includes(opt.value);
                        return (
                          <label key={opt.value} className="flex items-center gap-3.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleCheckbox(field.id, opt.value)}
                              className="sr-only"
                            />
                            <div className={cn(
                              "w-4.5 h-4.5 rounded-[5px] border border-neutral-300 flex items-center justify-center transition-all group-hover:border-[#101828] bg-white",
                              isSelected ? "border-[#101828] bg-[#101828]" : ""
                            )}>
                              {isSelected && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="text-[13.5px] font-semibold text-[#1e293b] group-hover:text-[#101828] transition-colors">
                              {opt.label}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between mt-6 pt-2">
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[12.5px] font-bold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 bg-[#101828] hover:bg-neutral-800 text-white text-[13.5px] font-bold rounded-xl transition-all cursor-pointer shadow-sm hover:shadow"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
