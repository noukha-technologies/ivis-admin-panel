
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { PaymentTransactionDrawer } from '@/components/payments/PaymentTransactionDrawer';
import { customerTransactionService } from '@/api/services/customer-transaction.service';
import { usePaymentTransactions } from '@/features/payments/hooks/usePaymentTransactions';
import { emptyPaymentForm, type PaymentFormState } from '@/features/payments/types';
import { useIntake } from '@/features/intake/IntakeContext';
import { useMasterLookups } from '@/hooks/useMasterLookups';
import { computePaymentAmounts } from '@/features/payments/paymentAmounts';


const PaymentsPage: React.FC = () => {
  const [showNewDrawer, setShowNewDrawer] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentFormState>(emptyPaymentForm);
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({
    mode: [],
    type: [],
  });

  const intake = useIntake();
  const { centres, lines, cameras, adminPcs, paymentModes } = useMasterLookups();
  const paymentsApi = usePaymentTransactions();

  const [centreId, setCentreId] = useState('');
  const [lineId, setLineId] = useState('');
  const [adminPcId, setAdminPcId] = useState('');
  const [cameraId, setCameraId] = useState('');

  const paymentModeOptions = useMemo(
    () => paymentModes.map((m) => m.name),
    [paymentModes],
  );

  useEffect(() => {
    if (centres.length && !centreId) setCentreId(centres[0].id);
    if (lines.length && !lineId) setLineId(lines[0].id);
    if (adminPcs.length && !adminPcId) setAdminPcId(adminPcs[0].id);
    if (cameras.length && !cameraId) setCameraId(cameras[0].id);
  }, [centres, lines, adminPcs, cameras, centreId, lineId, adminPcId, cameraId]);

  const updatePaymentForm = <K extends keyof PaymentFormState>(
    key: K,
    value: PaymentFormState[K],
  ) => {
    setPaymentForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleOpenDrawer = () => {
    setPaymentForm({
      ...emptyPaymentForm(),
      phone: intake.customerPhone ?? '',
      customerName: intake.customerName ?? '',
      vehicleNumber: intake.plateNumber ?? '',
      paymentMode: paymentModeOptions[0] ?? 'Cash',
    });
    setShowNewDrawer(true);
  };

  const handleDrawerOpenChange = (open: boolean) => {
    setShowNewDrawer(open);
    if (!open) {
      setPaymentForm(emptyPaymentForm());
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    const phone = paymentForm.phone.trim();
    const customerName = paymentForm.customerName.trim();
    const vehicleNumber = paymentForm.vehicleNumber.trim();

    if (!phone || !customerName || !vehicleNumber) {
      toast.error('Phone, customer name, and vehicle number are required');
      return;
    }

    let customerId = intake.customerId;
    let vehicleRecordId = intake.vehicleRecordId;

    if (!customerId || !vehicleRecordId) {
      try {
        const customer = await customerTransactionService.create({
          name: customerName,
          phone,
          plate_number: vehicleNumber,
        });
        customerId = customer.id;
        vehicleRecordId = customer.primary_vehicle_record_id ?? undefined;
        if (!vehicleRecordId) {
          toast.error('Could not link vehicle to customer');
          return;
        }
      } catch {
        toast.error('Failed to create customer and vehicle');
        return;
      }
    }

    const isFoc = paymentForm.paymentType === 'FOC';
    const grandTotal = isFoc ? 0 : parseFloat(paymentForm.amount) || 0;

    if (!isFoc && grandTotal <= 0) {
      toast.error('Enter a valid amount for paid transactions');
      return;
    }

    const { charges, vat } = isFoc ? { charges: 0, vat: 0 } : computePaymentAmounts(grandTotal);

    const created = await paymentsApi.createPayment({
      customer_id: customerId,
      vehicle_record_id: vehicleRecordId,
      appointment_id: intake.appointmentId,
      anpr_capture_id: intake.anprCaptureId,
      centre_id: centreId || undefined,
      line_id: lineId || undefined,
      admin_pc_id: adminPcId || undefined,
      camera_id: cameraId || undefined,
      payment_type: paymentForm.paymentMode,
      status: 'Paid',
      charges,
      vat,
      grand_total: grandTotal,
      pay_date: new Date().toISOString(),
      auto_create_job: true,
      job_source: 'Booked',
    });

    if (created) {
      intake.setFromPayment(created);
      handleDrawerOpenChange(false);
      toast.success(created.job_id ? 'Payment recorded — job created' : 'Payment recorded');
    } else if (paymentsApi.error) {
      toast.error(paymentsApi.error);
    }
  };

  const filteredPayments = paymentsApi.items.filter((p) => {
    const modeFilter = activeFilters.mode as string[] | undefined;
    const typeFilter = activeFilters.type as string[] | undefined;
    if (modeFilter?.length && !modeFilter.includes(p.mode)) return false;
    if (typeFilter?.length && !typeFilter.includes(p.type)) return false;
    return true;
  });


  return (
    <div className="flex flex-col min-h-full">
      <div
        className="flex flex-col gap-4 min-h-full"
        style={{ marginLeft: '20px', marginRight: '20px', marginTop: '6px' }}
      >
        <div className="flex justify-between items-center" style={{ minHeight: '38px' }}>
          <div className="flex items-center gap-3">
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
                value={paymentsApi.searchQuery}
                onChange={(e) => {
                  paymentsApi.setSearchQuery(e.target.value);
                  paymentsApi.setPage(1);
                }}
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

            <FilterDropdown
              align="left"
              fields={[
                {
                  id: 'mode',
                  label: 'Payment Mode',
                  type: 'select',
                  selectType: 'single',
                  options: [
                    { label: 'Cash', value: 'Cash' },
                    { label: 'Card', value: 'Card' },
                    { label: 'UPI', value: 'UPI' },
                    { label: 'External API', value: 'External API' },
                  ],
                  value: activeFilters.mode,
                },
                {
                  id: 'type',
                  label: 'Payment Type',
                  type: 'select',
                  selectType: 'multiple',
                  options: [
                    { label: 'Paid', value: 'Paid' },
                    { label: 'FOC', value: 'FOC' },
                    { label: 'Pending', value: 'Pending' },
                    { label: 'Cancelled', value: 'Cancelled' },
                  ],
                  value: activeFilters.type,
                },
              ]}
              onChange={(updated) => {
                setActiveFilters(updated);
                paymentsApi.setPage(1);
              }}
            />
          </div>
          <button
            onClick={handleOpenDrawer}
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
            <span
              style={{
                fontSize: '18px',
                fontWeight: '400',
                lineHeight: '1',
                display: 'inline-block',
                position: 'relative',
                top: '-1px',
              }}
            >
              +
            </span>
            <span>New Payment</span>
          </button>
        </div>

        <div className="w-full overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th
                  className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap cursor-pointer select-none"
                  style={{ padding: '12px 20px' }}
                >
                  <div className="flex items-center gap-1">
                    Transaction ID
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>
                  Customer
                </th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>
                  Vehicle
                </th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>
                  Total
                </th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>
                  Mode
                </th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentsApi.isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                    Loading…
                  </td>
                </tr>
              ) : filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-100 transition-colors duration-150 cursor-pointer hover:bg-gray-50 bg-white"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 underline">{payment.displayId}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{payment.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{payment.vehicle}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{payment.total}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{payment.mode}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{payment.type}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-white">
            <span className="text-[13px] text-slate-500 font-medium">
              Page {paymentsApi.page} of {paymentsApi.totalPages} · {paymentsApi.total} Records
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => paymentsApi.setPage((p) => Math.max(1, p - 1))}
                disabled={paymentsApi.page === 1}
                className={`px-4 py-1.5 text-[13px] font-medium border border-slate-300 rounded-lg bg-white transition-all duration-150 ${paymentsApi.page === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
              >
                Previous
              </button>
              <button
                onClick={() => paymentsApi.setPage((p) => Math.min(paymentsApi.totalPages, p + 1))}
                disabled={paymentsApi.page >= paymentsApi.totalPages}
                className={`px-4 py-1.5 text-[13px] font-medium border border-slate-300 rounded-lg bg-white transition-all duration-150 ${paymentsApi.page >= paymentsApi.totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>

      <PaymentTransactionDrawer
        open={showNewDrawer}
        onOpenChange={handleDrawerOpenChange}
        onSubmit={handleCreatePayment}
        form={paymentForm}
        onFormChange={updatePaymentForm}
        paymentModeOptions={paymentModeOptions}
        isSubmitting={paymentsApi.isSubmitting}
      />
    </div>
  );
};

export default PaymentsPage;
