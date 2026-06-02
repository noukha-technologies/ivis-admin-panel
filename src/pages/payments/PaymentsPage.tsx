
import React, { useEffect, useMemo, useState } from 'react';
import { PermissionGate } from '../../components/PermissionGate';
import { PERMISSIONS } from '../../constants/permissions';
import { toast } from 'sonner';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { PaymentTransactionDrawer } from '@/components/payments/PaymentTransactionDrawer';
import { customerTransactionService } from '@/api/services/customer-transaction.service';
import { usePaymentTransactions } from '@/features/payments/hooks/usePaymentTransactions';
import { emptyPaymentForm, type PaymentFormState } from '@/features/payments/types';
import { useIntake } from '@/features/intake/IntakeContext';
import { useMasterLookups } from '@/hooks/useMasterLookups';
import { computePaymentAmounts } from '@/features/payments/paymentAmounts';
import { DataTable } from '@/components/ui/DataTable';
import type { ColumnDef } from '@/interfaces/ui.interfaces';
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

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      id: 'displayId',
      header: 'Transaction ID',
      accessorKey: 'displayId',
      cell: ({ value }) => <span className="font-semibold text-gray-900 underline">{value}</span>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: 'customer',
      header: 'Customer',
      accessorKey: 'customer',
      cell: ({ value }) => <span className="text-gray-500 font-medium">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'vehicle',
      header: 'Vehicle',
      accessorKey: 'vehicle',
      cell: ({ value }) => <span className="text-gray-500 font-medium">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'total',
      header: 'Total',
      accessorKey: 'total',
      cell: ({ value }) => <span className="text-gray-500 font-medium">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'mode',
      header: 'Mode',
      accessorKey: 'mode',
      cell: ({ value }) => <span className="text-gray-500 font-medium">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'type',
      header: 'Type',
      accessorKey: 'type',
      cell: ({ value }) => <span className="text-gray-500 font-medium">{value}</span>,
      enableSorting: true,
    },
  ], []);

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
      <div className="flex flex-col gap-4 min-h-full mx-5 mt-1.5">
        <div className="flex justify-between items-center min-h-[38px]">
          <PermissionGate permission={PERMISSIONS.PAYMENTS_CREATE}>
            <button
              onClick={handleOpenDrawer}
              type="button"
              className="transition-all cursor-pointer hover:bg-opacity-95 bg-[#1c1c1e] text-white border-none rounded-[10px] px-[18px] py-2 text-[13px] font-semibold flex items-center justify-center gap-1 shadow-[0_1px_2px_rgba(0,0,0,0.08)] h-[38px]"
            >
              <span className="text-[18px] font-normal leading-none inline-block relative -top-[1px]">
                +
              </span>
              <span>New Payment</span>
            </button>
          </PermissionGate>

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
                className="bg-white transition-all focus:outline-none focus:border-gray-400 w-[320px] h-[38px] border border-[#cbd5e1] rounded-[10px] pl-10 pr-4 text-[14px] text-[#1e293b] box-border"
              />
            </div>

            <FilterDropdown
              align="right"
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
        </div>

        <DataTable
          loading={paymentsApi.isLoading}
          data={filteredPayments}
          columns={columns}
          showControls={false}
          showPagination={true}
          serverSidePagination={true}
          totalRows={paymentsApi.total}
          totalPages={paymentsApi.totalPages}
          currentPage={paymentsApi.page}
          onPageChange={paymentsApi.setPage}
        />
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
