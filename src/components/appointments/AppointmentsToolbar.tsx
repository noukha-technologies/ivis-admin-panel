import React from 'react';
import leftButten from '@/assets/images/left_butten.svg';
import rightButten from '@/assets/images/right_butten.svg';

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
}) => (
  <div className="flex justify-between items-center" style={{ minHeight: '38px' }}>
    {viewMode === 'calendar' ? (
      <div>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevMonth}
            className="cursor-pointer transition-opacity hover:opacity-80 active:opacity-60"
            style={{ background: 'none', border: 'none', padding: 0, lineHeight: 0 }}
            type="button"
          >
            <img src={leftButten} alt="Previous" style={{ width: '32px', height: '32px' }} />
          </button>

          <span
            className="font-bold text-[14px] mx-20 text-[#222]"
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

          <div className="flex items-center ml-2 relative font-bold text-[14px] text-gray-700 hover:text-black transition-colors gap-1">
            <select
              value={currentYear}
              onChange={(e) => onYearChange(e.target.value)}
              className="bg-transparent font-bold text-[14px] text-gray-700 hover:text-black cursor-pointer appearance-none pr-4 focus:outline-none"
              style={{ border: 'none', padding: 0 }}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </select>
            <span className="absolute right-0 pointer-events-none text-gray-500">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
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

    <div className="flex items-center gap-3">
      {viewMode === 'calendar' && (
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
      )}

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
    </div>
  </div>
);
