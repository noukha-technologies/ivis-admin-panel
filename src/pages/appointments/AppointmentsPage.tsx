import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useAppointments } from '../../features/appointments/hooks/useAppointments';
import { useIntake } from '../../features/intake/IntakeContext';
import { useMasterLookups } from '../../hooks/useMasterLookups';
import { anprCaptureService } from '../../api/services/anpr-capture.service';
import type { AppointmentCalendarItem } from '../../features/appointments/types';
import { MONTH_NAMES } from '@/constants/appointments';
import { buildCalendarGridCells, getDaysInMonth } from '@/utils/calendarGrid';
import { AppointmentsToolbar } from '@/components/appointments/AppointmentsToolbar';
import { AppointmentsCalendarView } from '@/components/appointments/AppointmentsCalendarView';
import { AppointmentsListView } from '@/components/appointments/AppointmentsListView';
import { WalkInEntryDrawer } from '@/components/appointments/WalkInEntryDrawer';
import { AppointmentDetailModal } from '@/components/appointments/AppointmentDetailModal';
import type { WalkInFormState, WalkInPaymentState } from '@/interfaces/appointment.interface';

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

  const handlePrevMonth = () => {
    const idx = MONTH_NAMES.indexOf(currentMonth as (typeof MONTH_NAMES)[number]);
    if (idx === 0) {
      setCurrentMonth(MONTH_NAMES[11]);
      setCurrentYear((prev) => String(parseInt(prev, 10) - 1));
    } else {
      setCurrentMonth(MONTH_NAMES[idx - 1]);
    }
  };

  const handleNextMonth = () => {
    const idx = MONTH_NAMES.indexOf(currentMonth as (typeof MONTH_NAMES)[number]);
    if (idx === 11) {
      setCurrentMonth(MONTH_NAMES[0]);
      setCurrentYear((prev) => String(parseInt(prev, 10) + 1));
    } else {
      setCurrentMonth(MONTH_NAMES[idx + 1]);
    }
  };

  const [showNewModal, setShowNewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentCalendarItem | null>(null);

  const [walkInForm, setWalkInForm] = useState<WalkInFormState>({
    plate: '',
    customerName: '',
    phoneNumber: '',
    type: 'OM 0082',
    vehicleNo: 'OM 0082',
    chassisNo: '9003 30039',
    mulkiyaId: 'OMN 0934',
    day: '8',
  });

  const [walkInPayment, setWalkInPayment] = useState<WalkInPaymentState>({
    phone: '',
    amount: '',
    type: 'Paid',
    mode: 'Cash',
  });

  const updateWalkInForm = <K extends keyof WalkInFormState>(key: K, value: WalkInFormState[K]) => {
    setWalkInForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateWalkInPayment = <K extends keyof WalkInPaymentState>(key: K, value: WalkInPaymentState[K]) => {
    setWalkInPayment((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInForm.plate.trim() || !walkInForm.customerName.trim() || !walkInForm.phoneNumber.trim()) {
      toast.error('Plate, customer name, and phone are required');
      return;
    }

    let anprId = intake.anprCaptureId;
    if (!anprId && cameras[0]) {
      const capture = await anprCaptureService.create({
        plate_number: walkInForm.plate.trim(),
        capture_time: new Date().toISOString(),
        camera_id: cameras[0].id,
        simulate_rop: true,
      });
      anprId = capture.id;
      intake.setFromAnpr(capture);
    }

    const appointmentAt = new Date(
      parseInt(currentYear, 10),
      MONTH_NAMES.indexOf(currentMonth as (typeof MONTH_NAMES)[number]),
      parseInt(walkInForm.day, 10) || new Date().getDate(),
      10,
      0,
    ).toISOString();

    const created = await appointmentsApi.createAppointment({
      anpr_capture_id: anprId,
      centre_id: centreId || undefined,
      line_id: lineId || undefined,
      plate_number: walkInForm.plate.trim(),
      customer_name: walkInForm.customerName.trim(),
      customer_phone: walkInForm.phoneNumber.trim(),
      id_number: walkInForm.mulkiyaId || undefined,
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

  const gridCells = useMemo(
    () => buildCalendarGridCells(currentYear, currentMonth),
    [currentYear, currentMonth],
  );

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  return (
    <div
      className="flex flex-col gap-4"
      style={{ marginLeft: '20px', marginRight: '20px', paddingBottom: '40px', marginTop: '6px' }}
    >
      <AppointmentsToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentMonth={currentMonth}
        currentYear={currentYear}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onYearChange={setCurrentYear}
        searchQuery={appointmentsApi.searchQuery}
        onSearchChange={appointmentsApi.setSearchQuery}
        onNewWalkIn={() => setShowNewModal(true)}
      />

      {viewMode === 'calendar' ? (
        <AppointmentsCalendarView
          gridCells={gridCells}
          currentMonth={currentMonth}
          currentYear={currentYear}
          appointments={appointmentsApi.calendarItems}
          onAppointmentClick={(appt) => {
            setSelectedAppointment(appt);
            setShowDetailModal(true);
          }}
        />
      ) : (
        <AppointmentsListView
          rows={appointmentsApi.listRows}
          searchQuery={appointmentsApi.searchQuery}
          isLoading={appointmentsApi.isLoading}
        />
      )}

      <WalkInEntryDrawer
        open={showNewModal}
        onOpenChange={setShowNewModal}
        currentMonth={currentMonth}
        currentYear={currentYear}
        daysInMonth={daysInMonth}
        form={walkInForm}
        payment={walkInPayment}
        onSubmit={handleCreateWalkIn}
        onConvertToJob={() => {
          void handleCreateWalkIn({ preventDefault: () => undefined } as React.FormEvent);
        }}
        onFormChange={updateWalkInForm}
        onPaymentChange={updateWalkInPayment}
      />

      {showDetailModal && selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          currentMonth={currentMonth}
          currentYear={currentYear}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
