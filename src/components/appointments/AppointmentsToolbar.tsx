import React, { useState } from 'react';
import leftButten from '@/assets/images/left_butten.svg';
import rightButten from '@/assets/images/right_butten.svg';
import { PermissionGate } from '@/components/PermissionGate';
import { PERMISSIONS } from '@/constants/permissions';

interface AppointmentsToolbarProps {
  viewMode: 'calendar' | 'list';
  onViewModeChange: (mode: 'calendar' | 'list') => void;
  currentMonth: string;
  currentYear: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onYearChange: (year: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNewWalkIn: () => void;
}

export const AppointmentsToolbar: React.FC<AppointmentsToolbarProps> = ({
  viewMode,
  onViewModeChange,
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth,
  onYearChange,
  searchQuery,
  onSearchChange,
  onNewWalkIn,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const years = Array.from({ length: 16 }, (_, i) => String(2020 + i));

  return (
    <div className="flex justify-between items-center" style={{ minHeight: '38px' }}>
      {/* Left Side: Always Calendar / List View toggle buttons */}
      <div
        style={{
          backgroundColor: '#f1f3f5',
          padding: '4px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          height: '38px',
          boxSizing: 'border-box',
        }}
      >
        <button
          onClick={() => onViewModeChange('calendar')}
          type="button"
          className="transition-all cursor-pointer"
          style={
            viewMode === 'calendar'
              ? {
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  color: '#1e293b',
                  fontWeight: 'bold',
                  padding: '6px 16px',
                  fontSize: '13px',
                }
              : {
                  backgroundColor: 'transparent',
                  border: '1px solid transparent',
                  color: '#64748b',
                  fontWeight: '600',
                  padding: '6px 16px',
                  fontSize: '13px',
                }
          }
        >
          Calendar
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          type="button"
          className="transition-all cursor-pointer"
          style={
            viewMode === 'list'
              ? {
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  color: '#1e293b',
                  fontWeight: 'bold',
                  padding: '6px 16px',
                  fontSize: '13px',
                }
              : {
                  backgroundColor: 'transparent',
                  border: '1px solid transparent',
                  color: '#64748b',
                  fontWeight: '600',
                  padding: '6px 16px',
                  fontSize: '13px',
                }
          }
        >
          List View
        </button>
      </div>

      {/* Right Side: Search (in List view) OR Month Nav + Walk-In (in Calendar view) */}
      <div className="flex items-center gap-3">
        {viewMode === 'calendar' ? (
          <>
            {/* Month & Year Navigation */}
            <div className="flex items-center gap-1 mr-3">
              <button
                onClick={onPrevMonth}
                className="cursor-pointer transition-opacity hover:opacity-80 active:opacity-60"
                style={{ background: 'none', border: 'none', padding: 0, lineHeight: 0 }}
                type="button"
              >
                <img src={leftButten} alt="Previous" style={{ width: '32px', height: '32px' }} />
              </button>

              <span
                className="font-bold text-[14px] text-[#222]"
                style={{ margin: '0 8px', fontWeight: 700, fontSize: '14px', color: '#222', minWidth: '32px', textAlign: 'center' }}
              >
                {currentMonth}
              </span>

              <button
                onClick={onNextMonth}
                className="cursor-pointer transition-opacity hover:opacity-80 active:opacity-60"
                style={{ background: 'none', border: 'none', padding: 0, lineHeight: 0 }}
                type="button"
              >
                <img src={rightButten} alt="Next" style={{ width: '32px', height: '32px' }} />
              </button>

              <div className="relative inline-block ml-3">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-full px-3 py-1 shadow-xs hover:border-neutral-300 transition-all cursor-pointer font-bold text-[13px] text-[#1e293b]"
                >
                  <span>{currentYear}</span>
                  <svg className="w-3 h-3 text-gray-500 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {isOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute left-0 mt-1 z-50 w-20 max-h-48 overflow-y-auto bg-white border border-neutral-200 rounded-xl shadow-lg p-1 flex flex-col gap-0.5">
                      {years.map((yr) => {
                        const isSelected = yr === currentYear;
                        return (
                          <button
                            key={yr}
                            onClick={() => {
                              onYearChange(yr);
                              setIsOpen(false);
                            }}
                            type="button"
                            className="w-full text-center py-1 text-[13px] font-bold rounded-lg transition-colors cursor-pointer"
                            style={{
                              backgroundColor: isSelected ? '#f1f3f5' : 'transparent',
                              color: isSelected ? '#1e293b' : '#64748b',
                            }}
                            onMouseEnter={(e) => {
                              if (yr !== currentYear) {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                                e.currentTarget.style.color = '#1e293b';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (yr !== currentYear) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#64748b';
                              }
                            }}
                          >
                            {yr}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            <PermissionGate permission={PERMISSIONS.APPOINTMENTS_CREATE}>
              <button
                onClick={onNewWalkIn}
                type="button"
                className="transition-all cursor-pointer hover:bg-opacity-95"
                style={{
                  backgroundColor: '#1c1c1e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                  height: '38px',
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: '400', lineHeight: '1', display: 'inline-block', position: 'relative', top: '-1px' }}>+</span>
                <span>New Walk-in</span>
              </button>
            </PermissionGate>
          </>
        ) : (
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <svg className="w-4.5 h-4.5" fill="none" stroke="#64748b" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-white transition-all focus:outline-none focus:border-gray-400"
              style={{
                width: '320px',
                height: '38px',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                paddingLeft: '40px',
                paddingRight: '16px',
                fontSize: '14px',
                color: '#1e293b',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
