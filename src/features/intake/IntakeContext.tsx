import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ApiAnprCapture } from '../../interfaces/anpr-capture.interface';
import type { ApiAppointment } from '../../interfaces/appointment.interface';
import type { ApiPaymentTransaction } from '../../interfaces/payment-transaction.interface';

export interface IntakeState {
  anprCaptureId?: string;
  customerId?: string;
  vehicleRecordId?: string;
  appointmentId?: string;
  paymentId?: string;
  jobId?: string;
  plateNumber?: string;
}

interface IntakeContextValue extends IntakeState {
  setFromAnpr: (capture: ApiAnprCapture) => void;
  setFromAppointment: (appointment: ApiAppointment) => void;
  setFromPayment: (payment: ApiPaymentTransaction) => void;
  setPartial: (partial: Partial<IntakeState>) => void;
  clear: () => void;
}

const IntakeContext = createContext<IntakeContextValue | null>(null);

export function IntakeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<IntakeState>({});

  const setFromAnpr = useCallback((capture: ApiAnprCapture) => {
    setState((prev) => ({
      ...prev,
      anprCaptureId: capture.id,
      plateNumber: capture.plate_number,
    }));
  }, []);

  const setFromAppointment = useCallback((appointment: ApiAppointment) => {
    setState((prev) => ({
      ...prev,
      appointmentId: appointment.id,
      anprCaptureId: appointment.anpr_capture_id ?? prev.anprCaptureId,
      customerId: appointment.customer_id ?? prev.customerId,
      vehicleRecordId: appointment.vehicle_record_id ?? prev.vehicleRecordId,
      plateNumber: appointment.plate_number ?? prev.plateNumber,
    }));
  }, []);

  const setFromPayment = useCallback((payment: ApiPaymentTransaction) => {
    setState((prev) => ({
      ...prev,
      paymentId: payment.id,
      jobId: payment.job_id ?? prev.jobId,
      appointmentId: payment.appointment_id ?? prev.appointmentId,
      customerId: payment.customer_id,
      vehicleRecordId: payment.vehicle_record_id,
      anprCaptureId: payment.anpr_capture_id ?? prev.anprCaptureId,
    }));
  }, []);

  const setPartial = useCallback((partial: Partial<IntakeState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const clear = useCallback(() => setState({}), []);

  const value = useMemo(
    () => ({
      ...state,
      setFromAnpr,
      setFromAppointment,
      setFromPayment,
      setPartial,
      clear,
    }),
    [state, setFromAnpr, setFromAppointment, setFromPayment, setPartial, clear],
  );

  return <IntakeContext.Provider value={value}>{children}</IntakeContext.Provider>;
}

export function useIntake(): IntakeContextValue {
  const ctx = useContext(IntakeContext);
  if (!ctx) {
    throw new Error('useIntake must be used within IntakeProvider');
  }
  return ctx;
}
