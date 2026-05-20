import React, { useState } from 'react';

interface Appointment {
  id: string;
  plate: string;
  type: string;
  day: number;
  priority: 'High' | 'Low';
  status: 'green' | 'red';
  time: string;
  stage: string;
}

const AppointmentsPage: React.FC = () => {
  const [currentYear] = useState('2025');
  const [currentMonth] = useState('Mar');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  
  // Modals state
  const [showNewModal, setShowNewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // New Walk-in form state
  const [newPlate, setNewPlate] = useState('');
  const [newType, setNewType] = useState('Sedan');
  const [newPriority, setNewPriority] = useState<'High' | 'Low'>('High');
  const [newDay, setNewDay] = useState('8');

  // Hardcoded initial appointments on Saturday March 8th
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      plate: 'OM-2000',
      type: 'Sedan',
      day: 8,
      priority: 'Low',
      status: 'green',
      time: '10:30 AM',
      stage: 'Emissions Testing'
    },
    {
      id: '2',
      plate: 'OM-2020',
      type: 'SUV',
      day: 8,
      priority: 'High',
      status: 'red',
      time: '11:15 AM',
      stage: 'ROP Verification'
    }
  ]);
  const listVehicles = [
    { seq: '01', customer: 'Ahmed Al-Said', vehicle: 'OM-1000', center: 'Muscat', line: 'Line 1', created: '01 Jan 2026 09:10' },
    { seq: '02', customer: 'Ahmed Al-Said', vehicle: 'OM-1000', center: 'Muscat', line: 'Muscat', created: '01 Jan 2026 09:10' },
    { seq: '03', customer: 'Ahmed Al-Said', vehicle: 'OM-1000', center: 'Muscat', line: 'Muscat', created: '01 Jan 2026 09:10' },
    { seq: '04', customer: 'Ahmed Al-Said', vehicle: 'OM-1000', center: 'Muscat', line: 'Muscat', created: '01 Jan 2026 09:10' },
    { seq: '05', customer: 'Ahmed Al-Said', vehicle: 'OM-1000', center: 'Muscat', line: 'Muscat', created: '01 Jan 2026 09:10' },
    { seq: '06', customer: 'Ahmed Al-Said', vehicle: 'OM-1000', center: 'Muscat', line: 'Muscat', created: '01 Jan 2026 09:10' },
    { seq: '07', customer: 'Ahmed Al-Said', vehicle: 'OM-1000', center: 'Muscat', line: 'Muscat', created: '01 Jan 2026 09:10' },
    { seq: '08', customer: 'Ahmed Al-Said', vehicle: 'OM-1000', center: 'Muscat', line: 'Muscat', created: '01 Jan 2026 09:10' },
    { seq: '09', customer: 'Ahmed Al-Said', vehicle: 'OM-1000', center: 'Muscat', line: 'Muscat', created: '01 Jan 2026 09:10' },
    { seq: '10', customer: 'Ahmed Al-Said', vehicle: 'OM-1000', center: 'Muscat', line: 'Muscat', created: '01 Jan 2026 09:10' }
  ];
  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;

    const newAppt: Appointment = {
      id: Date.now().toString(),
      plate: newPlate.toUpperCase(),
      type: newType,
      day: parseInt(newDay, 10),
      priority: newPriority,
      status: newPriority === 'High' ? 'red' : 'green',
      time: '12:00 PM',
      stage: 'Emissions'
    };

    setAppointments([...appointments, newAppt]);
    setNewPlate('');
    setShowNewModal(false);
  };

  // Days of March 2025 starting on Saturday
  // Feb 24 - Feb 28 are leading empty days (5 days)
  // March has 31 days.
  const daysInMonth = 31;
  const leadingEmptyDays = 5; // Monday to Friday before Sat March 1
  const totalGridCells = 42; // 6 rows * 7 columns

  const gridCells = [];
  for (let i = 1; i <= totalGridCells; i++) {
    if (i <= leadingEmptyDays) {
      gridCells.push({ isCurrentMonth: false, dayNum: null });
    } else {
      const dayNum = i - leadingEmptyDays;
      if (dayNum <= daysInMonth) {
        gridCells.push({ isCurrentMonth: true, dayNum });
      } else {
        gridCells.push({ isCurrentMonth: false, dayNum: null });
      }
    }
  }

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getAppointmentsForDay = (day: number) => {
    return appointments.filter(appt => appt.day === day);
  };

  return (
    <div className="flex flex-col gap-6" style={{ marginLeft: '20px', marginRight: '20px', paddingBottom: '40px' }}>
      
      {/* Top Header Block */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
            {viewMode === 'calendar' ? 'Appointments & Walk-ins' : 'Vehicles Queue'}
          </h1>
          <p className="text-[13px] text-gray-500 mt-1">
            {viewMode === 'calendar' 
              ? 'Manage scheduled appointments and walk-in entries' 
              : 'ANPR capture and ROP verification records'}
          </p>
        </div>

        {viewMode === 'calendar' && (
          <button 
            onClick={() => setShowNewModal(true)}
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
              height: '38px'
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: '400', lineHeight: '1', display: 'inline-block', position: 'relative', top: '-1px' }}>+</span>
            <span>New Walk-in</span>
          </button>
        )}
      </div>

      {/* Navigation / Switcher Bar */}
      <div className="flex justify-between items-center" style={{ minHeight: '38px' }}>
        {/* Left Side: Date Selector Navigation (only in calendar mode) */}
        <div>
          {viewMode === 'calendar' ? (
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg bg-white border border-neutral-200 text-gray-700 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors font-bold cursor-pointer">
                ←
              </button>
              
              <span className="font-bold text-[14px] px-2 text-[#222]">
                {currentMonth}
              </span>
              
              <button className="w-8 h-8 rounded-lg bg-white border border-neutral-200 text-gray-700 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors font-bold cursor-pointer">
                →
              </button>

              {/* Year inline selection */}
              <div className="flex items-center ml-2 cursor-pointer font-bold text-[14px] text-gray-700 hover:text-black transition-colors gap-1">
                <span>{currentYear}</span>
                <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              </div>
            </div>
          ) : (
            <div />
          )}
        </div>

        {/* Right Side Group: Search Input + View Switcher Tabs clustered together on the right */}
        <div className="flex items-center gap-3">
          {/* Search Input (only in list mode) */}
          {viewMode === 'list' && (
            <div className="relative">
              <span className="absolute inset-y-0 left-[14px] flex items-center pointer-events-none">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="#64748b" strokeWidth="1.8" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Search" 
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
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* View Switcher Tabs */}
          <div 
            style={{ 
              backgroundColor: '#f1f3f5', 
              padding: '4px', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              height: '38px',
              boxSizing: 'border-box'
            }}
          >
            <button 
              onClick={() => setViewMode('calendar')}
              className="transition-all cursor-pointer"
              style={viewMode === 'calendar' ? {
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                color: '#1e293b',
                fontWeight: 'bold',
                padding: '6px 16px',
                fontSize: '13px'
              } : {
                backgroundColor: 'transparent',
                border: '1px solid transparent',
                color: '#64748b',
                fontWeight: '600',
                padding: '6px 16px',
                fontSize: '13px'
              }}
            >
              Calendar
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className="transition-all cursor-pointer"
              style={viewMode === 'list' ? {
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                color: '#1e293b',
                fontWeight: 'bold',
                padding: '6px 16px',
                fontSize: '13px'
              } : {
                backgroundColor: 'transparent',
                border: '1px solid transparent',
                color: '#64748b',
                fontWeight: '600',
                padding: '6px 16px',
                fontSize: '13px'
              }}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'calendar' ? (
        /* Calendar View Box */
        <div className="bg-white border border-neutral-200 rounded-[16px] shadow-sm overflow-hidden">
          {/* Weekday Row */}
          <div className="grid grid-cols-7 border-b border-neutral-200 bg-white">
            {weekdays.map((day, idx) => (
              <div 
                key={day} 
                className="text-center py-3.5 text-[13px] font-semibold text-gray-500"
                style={{ borderRight: idx === 6 ? 'none' : '1px solid #e5e7eb' }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 bg-white">
            {gridCells.map((cell, idx) => {
              const dayAppts = cell.dayNum ? getAppointmentsForDay(cell.dayNum) : [];
              const isLastCol = (idx + 1) % 7 === 0;
              const isLastRow = idx >= 35;
              const isSaturday8 = cell.dayNum === 8;

              return (
                <div 
                  key={idx}
                  style={{
                    minHeight: '110px',
                    backgroundColor: isSaturday8 ? '#EAEAEC' : '#ffffff',
                    borderRight: isLastCol ? 'none' : '1px solid #e5e7eb',
                    borderBottom: isLastRow ? 'none' : '1px solid #e5e7eb',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px 14px',
                    position: 'relative'
                  }}
                >
                  {/* Day header (Number + Indicator) */}
                  {cell.dayNum && (
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[13px] font-semibold text-gray-800">
                        {cell.dayNum}
                      </span>
                      {isSaturday8 && (
                        <span 
                          className="w-5 h-5 rounded-full bg-[#1C2434] text-white text-[10px] font-bold flex items-center justify-center"
                          style={{
                            backgroundColor: '#1C2434',
                            color: '#ffffff',
                            fontWeight: 'bold'
                          }}
                        >
                          7
                        </span>
                      )}
                    </div>
                  )}

                  {/* Appointments items block */}
                  <div className="flex flex-col gap-1.5 mt-2.5 w-full">
                    {cell.dayNum && dayAppts.map((appt) => (
                      <button
                        key={appt.id}
                        onClick={() => {
                          setSelectedAppointment(appt);
                          setShowDetailModal(true);
                        }}
                        className="w-full text-center block rounded-[6px] px-2 py-1 text-[11px] font-bold border transition-all cursor-pointer"
                        style={{
                          backgroundColor: appt.status === 'green' ? '#E6F4EA' : '#FCE8E6',
                          borderColor: appt.status === 'green' ? '#34A853' : '#EA4335',
                          color: appt.status === 'green' ? '#137333' : '#C5221F',
                          borderWidth: '1.5px',
                          boxSizing: 'border-box'
                        }}
                      >
                        {appt.plate}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View Box */
        <div 
          className="bg-white border border-neutral-200 rounded-[16px] shadow-sm overflow-hidden"
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            backgroundColor: '#ffffff'
          }}
        >
          <table className="w-full text-left border-collapse" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead className="bg-white border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 text-[13px] text-gray-500 font-semibold pl-6" style={{ paddingLeft: '24px', paddingTop: '16px', paddingBottom: '16px' }}>
                  <span className="flex items-center gap-1 cursor-pointer">
                    Queue Sq
                    <span className="text-[12px] text-gray-400">↓</span>
                  </span>
                </th>
                <th className="px-6 py-4 text-[13px] text-gray-500 font-semibold">Customer</th>
                <th className="px-6 py-4 text-[13px] text-gray-500 font-semibold">Vehicle</th>
                <th className="px-6 py-4 text-[13px] text-gray-500 font-semibold">Center</th>
                <th className="px-6 py-4 text-[13px] text-gray-500 font-semibold">Line</th>
                <th className="px-6 py-4 text-[13px] text-gray-500 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {listVehicles.map((item, idx) => (
                <tr 
                  key={idx}
                  className="hover:bg-neutral-50/40 transition-colors"
                  style={{ borderBottom: idx < listVehicles.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                >
                  <td className="px-6 py-4 pl-6" style={{ paddingLeft: '24px', paddingTop: '16px', paddingBottom: '16px' }}>
                    <span 
                      className="text-[13px] font-bold text-[#1f2937]"
                      style={{
                        borderBottom: '1.5px solid #1f2937',
                        paddingBottom: '2px',
                        cursor: 'pointer'
                      }}
                    >
                      {item.seq}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13.5px] text-gray-600 font-semibold" style={{ color: '#4b5563' }}>{item.customer}</td>
                  <td className="px-6 py-4 text-[13.5px] text-[#1f2937] font-bold">{item.vehicle}</td>
                  <td className="px-6 py-4 text-[13.5px] text-gray-600 font-semibold" style={{ color: '#4b5563' }}>{item.center}</td>
                  <td className="px-6 py-4 text-[13.5px] text-gray-600 font-semibold" style={{ color: '#4b5563' }}>{item.line}</td>
                  <td className="px-6 py-4 text-[13.5px] text-gray-500 font-semibold" style={{ color: '#6b7280' }}>{item.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL: New Walk-in Entry Form */}
      {showNewModal && (
        <div className="fixed inset-0 bg-[#000000]/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
          <div className="bg-white border border-neutral-100 rounded-[20px] shadow-2xl p-6 w-[420px] transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[18px] font-bold text-[#111827]">New Walk-in Registration</h3>
              <button 
                onClick={() => setShowNewModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="flex flex-col gap-4">
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1.5">PLATE NUMBER</label>
                <input 
                  type="text" 
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  placeholder="e.g. OM-2030"
                  className="w-full border border-neutral-200 rounded-[10px] px-3.5 py-2.5 text-[14px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#111827]/10 focus:border-[#111827]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">VEHICLE TYPE</label>
                  <select 
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full border border-neutral-200 rounded-[10px] px-3 py-2.5 text-[14px] text-gray-800 focus:outline-none"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">DAY OF MARCH</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="31" 
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="w-full border border-neutral-200 rounded-[10px] px-3 py-2.5 text-[14px] text-gray-800 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1.5">PRIORITY</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[14px] text-gray-700">
                    <input 
                      type="radio" 
                      name="priority" 
                      checked={newPriority === 'High'}
                      onChange={() => setNewPriority('High')}
                      className="text-[#111827] focus:ring-0 w-4 h-4"
                    />
                    High Priority
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[14px] text-gray-700">
                    <input 
                      type="radio" 
                      name="priority" 
                      checked={newPriority === 'Low'}
                      onChange={() => setNewPriority('Low')}
                      className="text-[#111827] focus:ring-0 w-4 h-4"
                    />
                    Low Priority
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[13px] py-2.5 rounded-[10px] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-[#111827] hover:bg-black text-white font-semibold text-[13px] py-2.5 rounded-[10px] transition-colors"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Appointment Details */}
      {showDetailModal && selectedAppointment && (
        <div className="fixed inset-0 bg-[#000000]/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
          <div className="bg-white border border-neutral-100 rounded-[20px] shadow-2xl p-6 w-[400px]">
            <div className="flex justify-between items-center mb-4 border-b border-neutral-100 pb-3">
              <span className="text-[14px] font-bold text-[#111827] bg-[#F1F3F5] px-3 py-1 rounded-[6px]">
                {selectedAppointment.plate}
              </span>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4 text-[14px]">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Scheduled Date</span>
                <span className="font-semibold text-gray-800">{currentMonth} {selectedAppointment.day}, {currentYear}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Time Slot</span>
                <span className="font-semibold text-[#111827]">{selectedAppointment.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Vehicle Type</span>
                <span className="font-semibold text-gray-800">{selectedAppointment.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Diagnostic Stage</span>
                <span className="font-semibold text-[#136E27]">{selectedAppointment.stage}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Priority Level</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  selectedAppointment.priority === 'High' ? 'bg-[#FFDEDE] text-[#C92A2A]' : 'bg-[#DEF5E5] text-[#136E27]'
                }`}>
                  {selectedAppointment.priority}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setShowDetailModal(false)}
              className="w-full bg-[#111827] hover:bg-black text-white font-semibold text-[13px] py-2.5 rounded-[10px] transition-colors mt-6"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
