import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import leftButten from '../../assets/images/left_butten.svg';
import rightButten from '../../assets/images/right_butten.svg';
import { useAppointments } from '../../features/appointments/hooks/useAppointments';
import { useIntake } from '../../features/intake/IntakeContext';
import { useMasterLookups } from '../../hooks/useMasterLookups';
import { anprCaptureService } from '../../api/services/anpr-capture.service';
import type { AppointmentCalendarItem } from '../../features/appointments/types';

interface Appointment {
  id: string;
  plate: string;
  type: string;
  day: number;
  month: string;
  year: string;
  priority: 'High' | 'Low';
  status: 'green' | 'red';
  time: string;
  stage: string;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const AppointmentsPage: React.FC = () => {
  const intake = useIntake();
  const { centres, lines, cameras } = useMasterLookups();
  const appointmentsApi = useAppointments();
  const [centreId, setCentreId] = useState('');
  const [lineId, setLineId] = useState('');

  useEffect(() => {
    if (centres.length && !centreId) setCentreId(centres[0].id);
    if (lines.length && !lineId) setLineId(lines[0].id);
  }, [centres, lines, centreId, lineId]);

  const [currentYear, setCurrentYear] = useState(String(new Date().getFullYear()));
  const [currentMonth, setCurrentMonth] = useState(MONTH_NAMES[new Date().getMonth()]);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [listPage, setListPage] = useState(1);
  const LIST_PAGE_SIZE = 10;

  const handlePrevMonth = () => {
    const idx = MONTH_NAMES.indexOf(currentMonth);
    if (idx === 0) {
      setCurrentMonth('Dec');
      setCurrentYear(prev => String(parseInt(prev, 10) - 1));
    } else {
      setCurrentMonth(MONTH_NAMES[idx - 1]);
    }
  };

  const handleNextMonth = () => {
    const idx = MONTH_NAMES.indexOf(currentMonth);
    if (idx === 11) {
      setCurrentMonth('Jan');
      setCurrentYear(prev => String(parseInt(prev, 10) + 1));
    } else {
      setCurrentMonth(MONTH_NAMES[idx + 1]);
    }
  };

  // Modals state
  const [showNewModal, setShowNewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // New Walk-in form state
  const [newPlate, setNewPlate] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newType, setNewType] = useState('OM 0082');
  const [newVehicleNo, setNewVehicleNo] = useState('OM 0082');
  const [newChassisNo, setNewChassisNo] = useState('9003 30039');
  const [newMulkiyaId, setNewMulkiyaId] = useState('OMN 0934');
  const [newPriority] = useState<'High' | 'Low'>('High');
  void newPriority;
  const [newDay, setNewDay] = useState('8');

  // Payment states
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState<'Paid' | 'FOC'>('Paid');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'External API'>('Cash');

  const appointments: Appointment[] = appointmentsApi.calendarItems.map(
    (a: AppointmentCalendarItem) => ({
      id: a.id,
      plate: a.plate,
      type: a.type,
      day: a.day,
      month: a.month,
      year: a.year,
      priority: a.priority,
      status: a.status,
      time: a.time,
      stage: a.stage,
    }),
  );
  const listVehicles = appointmentsApi.listRows;

  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim() || !newCustomerName.trim() || !newPhoneNumber.trim()) {
      toast.error('Plate, customer name, and phone are required');
      return;
    }

    let anprId = intake.anprCaptureId;
    if (!anprId && cameras[0]) {
      const capture = await anprCaptureService.create({
        plate_number: newPlate.trim(),
        capture_time: new Date().toISOString(),
        camera_id: cameras[0].id,
        simulate_rop: true,
      });
      anprId = capture.id;
      intake.setFromAnpr(capture);
    }

    const appointmentAt = new Date(
      parseInt(currentYear, 10),
      MONTH_NAMES.indexOf(currentMonth),
      parseInt(newDay, 10) || new Date().getDate(),
      10,
      0,
    ).toISOString();

    const created = await appointmentsApi.createAppointment({
      anpr_capture_id: anprId,
      centre_id: centreId || undefined,
      line_id: lineId || undefined,
      plate_number: newPlate.trim(),
      customer_name: newCustomerName.trim(),
      customer_phone: newPhoneNumber.trim(),
      id_number: newMulkiyaId || undefined,
      appointment_at: appointmentAt,
      status: 'Scheduled',
      sync_customer: true,
    });

    if (created) {
      intake.setFromAppointment(created);
      toast.success('Walk-in appointment created');
      setShowNewModal(false);
    } else if (appointmentsApi.error) {
      toast.error(appointmentsApi.error);
    }
  };

  // Calculate dynamic days in the month and leading empty days to start on Monday
  const yearNum = parseInt(currentYear, 10);
  const monthIndex = MONTH_NAMES.indexOf(currentMonth);
  const firstDay = new Date(yearNum, monthIndex, 1);
  const rawDay = firstDay.getDay(); // 0 is Sunday, 1 is Monday...
  const leadingEmptyDays = rawDay === 0 ? 6 : rawDay - 1;
  const daysInMonth = new Date(yearNum, monthIndex + 1, 0).getDate();
  const totalGridCells = 42; // 6 rows * 7 columns

  const gridCells = [];
  // Leading empty cells
  for (let i = 0; i < leadingEmptyDays; i++) {
    gridCells.push({ isCurrentMonth: false, dayNum: null });
  }
  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    gridCells.push({ isCurrentMonth: true, dayNum: d });
  }
  // Trailing empty cells
  const remainingCells = totalGridCells - gridCells.length;
  for (let i = 0; i < remainingCells; i++) {
    gridCells.push({ isCurrentMonth: false, dayNum: null });
  }

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getAppointmentsForDay = (day: number) => {
    return appointments.filter(
      (appt) => appt.day === day && appt.month === currentMonth && appt.year === currentYear
    );
  };
  return (
    <div className="flex flex-col gap-4" style={{ marginLeft: '20px', marginRight: '20px', paddingBottom: '40px', marginTop: '6px' }}>

      {/* Top Navigation & Controls Bar (outside content widgets) */}
      <div className="flex justify-between items-center" style={{ minHeight: '38px' }}>
        {/* Left Side */}
        {viewMode === 'calendar' ? (
          /* Calendar: Date Selector Navigation */
          <div>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="cursor-pointer transition-opacity hover:opacity-80 active:opacity-60"
                style={{ background: 'none', border: 'none', padding: 0, lineHeight: 0 }}
              >
                <img src={leftButten} alt="Previous" style={{ width: '32px', height: '32px' }} />
              </button>

              <span className="font-bold text-[14px] mx-20 text-[#222]" style={{ margin: '0 8px', fontWeight: 700, fontSize: '14px', color: '#222', minWidth: '32px', textAlign: 'center' }}>
                {currentMonth}
              </span>

              <button
                onClick={handleNextMonth}
                className="cursor-pointer transition-opacity hover:opacity-80 active:opacity-60"
                style={{ background: 'none', border: 'none', padding: 0, lineHeight: 0 }}
              >
                <img src={rightButten} alt="Next" style={{ width: '32px', height: '32px' }} />
              </button>

              {/* Year inline dropdown selector */}
              <div className="flex items-center ml-2 relative font-bold text-[14px] text-gray-700 hover:text-black transition-colors gap-1">
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(e.target.value)}
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
          /* List View: Search Input on Left */
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
              value={appointmentsApi.searchQuery}
              onChange={(e) => appointmentsApi.setSearchQuery(e.target.value)}
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

        {/* Right Side: New Walk-in Button (Calendar Only) & Switcher Tabs */}
        <div className="flex items-center gap-3">
          {viewMode === 'calendar' && (
            <button
              onClick={() => setShowNewModal(true)}
              className="transition-all cursor-pointer hover:bg-opacity-95"
              style={{ backgroundColor: '#1c1c1e', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', height: '38px' }}
            >
              <span style={{ fontSize: '18px', fontWeight: '400', lineHeight: '1', display: 'inline-block', position: 'relative', top: '-1px' }}>+</span>
              <span>New Walk-in</span>
            </button>
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
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
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
              const isSaturday8 = cell.dayNum === 8 && currentMonth === 'Mar' && currentYear === '2025';

              return (
                <div
                  key={idx}
                  style={{
                    minHeight: '110px',
                    backgroundColor: isSaturday8 ? '#EAEAEC' : dayAppts.length > 0 ? '#fafafa' : '#ffffff',
                    borderRight: isLastCol ? 'none' : '1px solid #e5e7eb',
                    borderBottom: isLastRow ? 'none' : '1px solid #e5e7eb',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px 14px',
                    position: 'relative'
                  }}
                >
                  {/* Day header (Number + Dynamic Indicator count) */}
                  {cell.dayNum && (
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[13px] font-semibold text-gray-800">
                        {cell.dayNum}
                      </span>
                      {dayAppts.length > 0 && (
                        <span
                          className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                          style={{
                            backgroundColor: '#1C2434',
                            color: '#ffffff',
                            fontWeight: 'bold'
                          }}
                        >
                          {dayAppts.length}
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
                        className="w-full text-center block rounded-md px-2 py-1 text-[11px] font-bold border transition-all cursor-pointer"
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
        <div className="w-full overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">

          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap cursor-pointer select-none" style={{ padding: '12px 20px' }}>
                  <div className="flex items-center gap-1">
                    Queue Sq
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Customer</th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Vehicle</th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Center</th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Line</th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {listVehicles.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 transition-colors duration-150 cursor-pointer hover:bg-gray-50 bg-white"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 underline">
                    {item.seq}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.customer}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.vehicle}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.center}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.line}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-white">
            <span className="text-[13px] text-slate-500 font-medium">
              Page {listPage} of {Math.max(1, Math.ceil(listVehicles.length / LIST_PAGE_SIZE))} · {listVehicles.length} Records{appointmentsApi.isLoading ? ' (loading…)' : ''}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setListPage((p) => Math.max(1, p - 1))}
                disabled={listPage === 1}
                className={`px-4 py-1.5 text-[13px] font-medium border border-slate-300 rounded-lg bg-white transition-all duration-150 ${listPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
              >
                Previous
              </button>
              <button
                onClick={() => setListPage((p) => Math.min(Math.ceil(listVehicles.length / LIST_PAGE_SIZE), p + 1))}
                disabled={listPage >= Math.ceil(listVehicles.length / LIST_PAGE_SIZE)}
                className={`px-4 py-1.5 text-[13px] font-medium border border-slate-300 rounded-lg bg-white transition-all duration-150 ${listPage >= Math.ceil(listVehicles.length / LIST_PAGE_SIZE) ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: New Walk-in Entry Form */}
      {showNewModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 transition-all" style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
          <div
            style={{
              width: '920px',
              maxWidth: '95%',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '24px 32px',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              border: '1px solid #f3f4f6'
            }}
          >

            {/* Close Button on the very top right */}
            <button
              type="button"
              onClick={() => setShowNewModal(false)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
            >
              <svg width="22" height="22" fill="none" stroke="#9ca3af" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <form onSubmit={handleCreateWalkIn} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '24px' }}>

              {/* Left Column: New Walk-in Entry */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>New Walk-in Entry</h3>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Plate Number *</label>
                  <input
                    type="text"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    placeholder="Enter"
                    required
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      color: '#1f2937',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Appointment Day *</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={newDay}
                      onChange={(e) => setNewDay(e.target.value)}
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '10px',
                        padding: '8px 40px 8px 12px',
                        fontSize: '14px',
                        color: '#1f2937',
                        outline: 'none',
                        boxSizing: 'border-box',
                        backgroundColor: '#ffffff',
                        appearance: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={String(d)}>
                          {d} ({currentMonth} {d}, {currentYear})
                        </option>
                      ))}
                    </select>
                    <div style={{ position: 'absolute', top: '50%', right: '14px', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280' }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Customer Name *</label>
                  <input
                    type="text"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="Enter"
                    required
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      color: '#1f2937',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Phone Number *</label>
                  <input
                    type="tel"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    placeholder="Enter"
                    required
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      color: '#1f2937',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Vehicle Type *</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '10px',
                        padding: '8px 40px 8px 12px',
                        fontSize: '14px',
                        color: '#1f2937',
                        outline: 'none',
                        boxSizing: 'border-box',
                        backgroundColor: '#ffffff',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="OM 0082">OM 0082</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Truck">Truck</option>
                    </select>
                    <div style={{ position: 'absolute', top: '50%', right: '14px', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280' }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Vehicle No *</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={newVehicleNo}
                      onChange={(e) => setNewVehicleNo(e.target.value)}
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '10px',
                        padding: '8px 40px 8px 12px',
                        fontSize: '14px',
                        color: '#1f2937',
                        outline: 'none',
                        boxSizing: 'border-box',
                        backgroundColor: '#ffffff',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="OM 0082">OM 0082</option>
                      <option value="OM-2000">OM-2000</option>
                      <option value="OM-2020">OM-2020</option>
                    </select>
                    <div style={{ position: 'absolute', top: '50%', right: '14px', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280' }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Chassis No</label>
                  <input
                    type="text"
                    value={newChassisNo}
                    onChange={(e) => setNewChassisNo(e.target.value)}
                    placeholder="9003 30039"
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      color: '#1f2937',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Mulkiya Id</label>
                  <input
                    type="text"
                    value={newMulkiyaId}
                    onChange={(e) => setNewMulkiyaId(e.target.value)}
                    placeholder="OMN 0934"
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      color: '#1f2937',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>
              </div>

              {/* Separator Line */}
              <div style={{ width: '1px', backgroundColor: '#e5e7eb', alignSelf: 'stretch' }} />

              {/* Right Column: Add Payment */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>Add Payment</h3>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '2px' }}>Phone *</label>
                    <input
                      type="tel"
                      value={paymentPhone}
                      onChange={(e) => setPaymentPhone(e.target.value)}
                      placeholder="Enter"
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        color: '#1f2937',
                        outline: 'none',
                        boxSizing: 'border-box',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Amount (OMR)</label>
                    <input
                      type="text"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Enter"
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        color: '#1f2937',
                        outline: 'none',
                        boxSizing: 'border-box',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '8px' }}>Type</label>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151', fontWeight: 500, userSelect: 'none' }}>
                        <input
                          type="radio"
                          name="paymentType"
                          checked={paymentType === 'Paid'}
                          onChange={() => setPaymentType('Paid')}
                          style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#111827' }}
                        />
                        Paid
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151', fontWeight: 500, userSelect: 'none' }}>
                        <input
                          type="radio"
                          name="paymentType"
                          checked={paymentType === 'FOC'}
                          onChange={() => setPaymentType('FOC')}
                          style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#111827' }}
                        />
                        FOC
                      </label>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '8px' }}>Mode</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>

                      {/* Cash box */}
                      <button
                        type="button"
                        onClick={() => setPaymentMode('Cash')}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '16px 12px',
                          borderRadius: '12px',
                          border: paymentMode === 'Cash' ? '1.5px solid #9ca3af' : '1px solid #e5e7eb',
                          backgroundColor: paymentMode === 'Cash' ? '#e9ecef' : '#ffffff',
                          color: paymentMode === 'Cash' ? '#111827' : '#6b7280',
                          fontWeight: paymentMode === 'Cash' ? 600 : 400,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ marginBottom: '8px' }}>
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <circle cx="12" cy="12" r="3" />
                          <path d="M6 9h.01M18 15h.01" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontSize: '13px' }}>Cash</span>
                      </button>

                      {/* UPI box */}
                      <button
                        type="button"
                        onClick={() => setPaymentMode('UPI')}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '16px 12px',
                          borderRadius: '12px',
                          border: paymentMode === 'UPI' ? '1.5px solid #9ca3af' : '1px solid #e5e7eb',
                          backgroundColor: paymentMode === 'UPI' ? '#e9ecef' : '#ffffff',
                          color: paymentMode === 'UPI' ? '#111827' : '#6b7280',
                          fontWeight: paymentMode === 'UPI' ? 600 : 400,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ marginBottom: '8px' }}>
                          <rect x="6" y="2" width="12" height="20" rx="2" />
                          <path d="M12 6l-3 2v1h6V8l-3-2zM9 11v3h6v-3H9zM8 16h8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontSize: '13px' }}>UPI</span>
                      </button>

                      {/* External API box */}
                      <button
                        type="button"
                        onClick={() => setPaymentMode('External API')}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '16px 12px',
                          borderRadius: '12px',
                          border: paymentMode === 'External API' ? '1.5px solid #9ca3af' : '1px solid #e5e7eb',
                          backgroundColor: paymentMode === 'External API' ? '#e9ecef' : '#ffffff',
                          color: paymentMode === 'External API' ? '#111827' : '#6b7280',
                          fontWeight: paymentMode === 'External API' ? 600 : 400,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ marginBottom: '8px' }}>
                          <rect x="3" y="4" width="18" height="16" rx="2" />
                          <path d="M9 10a3 3 0 014.5 2.6M15 14a3 3 0 01-4.5-2.6" strokeLinecap="round" />
                          <path d="M12 9l-3 1 1 3M12 15l3-1-1-3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontSize: '13px', textAlign: 'center', lineHeight: '1.2' }}>External API</span>
                      </button>

                    </div>
                  </div>
                </div>

                {/* Bottom buttons inside the Right Column */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '28px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      handleCreateWalkIn({ preventDefault: () => { } } as React.FormEvent);
                    }}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #d1d5db',
                      color: '#1f2937',
                      fontWeight: 600,
                      fontSize: '14px',
                      padding: '10px 20px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Convert to Job
                  </button>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#1c1c1e',
                      border: '1px solid #1c1c1e',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '14px',
                      padding: '10px 24px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Confirm Entry
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: Appointment Details */}
      {showDetailModal && selectedAppointment && (
        <div className="fixed inset-0 bg-[#000000]/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
          <div className="bg-white border border-neutral-100 rounded-[20px] shadow-2xl p-6 w-100">
            <div className="flex justify-between items-center mb-4 border-b border-neutral-100 pb-3">
              <span className="text-[14px] font-bold text-[#111827] bg-[#F1F3F5] px-3 py-1 rounded-md">
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
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${selectedAppointment.priority === 'High' ? 'bg-[#FFDEDE] text-[#C92A2A]' : 'bg-[#DEF5E5] text-[#136E27]'
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
