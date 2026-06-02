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
  const [activeCategory, setActiveCategory] = useState(fields[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
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

  useEffect(() => {
    setSearchQuery('');
  }, [activeCategory, isOpen]);

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
            "absolute mt-2 w-[480px] bg-white border border-neutral-200 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.03)] z-50 overflow-hidden flex flex-row h-[320px] font-sans select-none animate-fadeInMenu",
            align === 'left' ? 'left-0' : 'right-0',
            className
          )}
        >
          {/* Left Panel: Sidebar */}
          <div className="w-[190px] border-r border-neutral-100 bg-[#FCFCFD] p-3 flex flex-col gap-1 overflow-y-auto flex-none">
            {fields.map((field) => {
              const isActive = field.id === activeCategory;
              const selectedOpts = localValues[field.id] || [];
              const selectedCount = selectedOpts.length;
              return (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => setActiveCategory(field.id)}
                  className={cn(
                    "w-full text-left px-3.5 py-2.5 rounded-xl text-[13.5px] font-bold transition-all flex items-center justify-between cursor-pointer border border-transparent",
                    isActive
                      ? "bg-white border border-neutral-200/60 shadow-[0_1px_2px_rgba(16,24,40,0.04)] text-[#101828]"
                      : "text-[#475467] hover:bg-neutral-50 hover:text-[#101828]"
                  )}
                >
                  <span className="truncate">{field.label}</span>
                  {selectedCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-[#101828] text-white text-[10.5px] font-bold flex-none">
                      {selectedCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Panel: Content */}
          {(() => {
            const field = fields.find((f) => f.id === activeCategory) || fields[0];
            if (!field) return null;

            const isRadioSection = field.selectType === 'single' || field.id === 'status' || field.id === 'mode';
            const selectedOpts = localValues[field.id] || [];

            // Filter options based on local search query
            const filteredOptions = (field.options || []).filter((opt) =>
              opt.label.toLowerCase().includes(searchQuery.toLowerCase())
            );

            return (
              <div className="flex-1 p-4.5 flex flex-col min-w-0 h-full bg-white">
                {/* Search Bar */}
                <div className="relative w-full mb-3 flex-none">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-1.5 text-[13px] bg-white border border-neutral-200 rounded-lg placeholder-neutral-400 text-[#1f2937] focus:outline-none focus:border-neutral-400 transition-all shadow-sm"
                  />
                </div>

                {/* Options List */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-1 min-h-0 mb-3 text-left">
                  {isRadioSection ? (
                    <>
                      {/* Prepend All option if searched label matches 'All' or search is empty */}
                      {('all'.includes(searchQuery.toLowerCase()) || !searchQuery) && (
                        <label className="flex items-center gap-3.5 cursor-pointer group hover:bg-neutral-50 px-3 py-2 rounded-xl transition-all -mx-1">
                          <input
                            type="radio"
                            name={field.id}
                            checked={selectedOpts.length === 0}
                            onChange={() => handleSelectRadio(field.id, 'All')}
                            className="sr-only"
                          />
                          <div className={cn(
                            "w-4.5 h-4.5 rounded-full border border-neutral-300 flex items-center justify-center transition-all group-hover:border-neutral-400 bg-white flex-none",
                            selectedOpts.length === 0 ? "border-[#101828] bg-[#101828]" : ""
                          )}>
                            {selectedOpts.length === 0 && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className="text-[13.5px] font-semibold text-[#344054] group-hover:text-[#101828] transition-colors truncate">
                            All
                          </span>
                        </label>
                      )}

                      {filteredOptions.map((opt) => {
                        const isSelected = selectedOpts.includes(opt.value);
                        return (
                          <label key={opt.value} className="flex items-center gap-3.5 cursor-pointer group hover:bg-neutral-50 px-3 py-2 rounded-xl transition-all -mx-1">
                            <input
                              type="radio"
                              name={field.id}
                              checked={isSelected}
                              onChange={() => handleSelectRadio(field.id, opt.value)}
                              className="sr-only"
                            />
                            <div className={cn(
                              "w-4.5 h-4.5 rounded-full border border-neutral-300 flex items-center justify-center transition-all group-hover:border-neutral-400 bg-white flex-none",
                              isSelected ? "border-[#101828] bg-[#101828]" : ""
                            )}>
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                              )}
                            </div>
                            <span className="text-[13.5px] font-semibold text-[#344054] group-hover:text-[#101828] transition-colors truncate">
                              {opt.label}
                            </span>
                          </label>
                        );
                      })}
                    </>
                  ) : (
                    /* Render Checkboxes for Multi-Select Sections */
                    filteredOptions.map((opt) => {
                      const isSelected = selectedOpts.includes(opt.value);
                      return (
                        <label key={opt.value} className="flex items-center gap-3.5 cursor-pointer group hover:bg-neutral-50 px-3 py-2 rounded-xl transition-all -mx-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleCheckbox(field.id, opt.value)}
                            className="sr-only"
                          />
                          <div className={cn(
                            "w-4.5 h-4.5 rounded-[5px] border border-neutral-300 flex items-center justify-center transition-all group-hover:border-[#101828] bg-white flex-none",
                            isSelected ? "border-[#101828] bg-[#101828]" : ""
                          )}>
                            {isSelected && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-[13.5px] font-semibold text-[#344054] group-hover:text-[#101828] transition-colors truncate">
                            {opt.label}
                          </span>
                        </label>
                      );
                    })
                  )}

                  {filteredOptions.length === 0 && (
                    <div className="py-8 text-center text-xs font-semibold text-neutral-400">
                      No options found
                    </div>
                  )}
                </div>

                {/* Footer Action Buttons inside Right Panel */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100 flex-none mt-auto">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="px-4 py-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-bold text-[13px] rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-5 py-2 bg-[#101828] hover:bg-neutral-800 text-white font-bold text-[13px] rounded-xl transition-all cursor-pointer shadow-sm hover:shadow"
                  >
                    Apply
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
