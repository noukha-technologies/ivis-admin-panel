import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import VehicleRecordsPage from '../vehicle-records/VehicleRecordsPage';
import { FilterDropdown } from '../../components/ui/FilterDropdown';
import CustomersPage from '../customers/CustomersPage';
import FileProcessingPage from '../file-processing/FileProcessingPage';
import RopManagementPage from '../rop-management/RopManagementPage';
import { usePaymentTransactions } from '../../features/payments/hooks/usePaymentTransactions';
import { useIntake } from '../../features/intake/IntakeContext';
import { useMasterLookups } from '../../hooks/useMasterLookups';

const PaymentsPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'Payments' | 'Vehicle Records' | 'Customers' | 'File Processing' | 'ROP Management'>('Payments');
  const [showNewModal, setShowNewModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({
    mode: [],
    type: [],
  });

  const intake = useIntake();
  const { centres, lines, cameras, adminPcs, paymentModes } = useMasterLookups();
  const paymentsApi = usePaymentTransactions();

  const [totalAmount, setTotalAmount] = useState('31.5');
  const [charges] = useState('30');
  const [vat] = useState('1.5');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [centreId, setCentreId] = useState('');
  const [lineId, setLineId] = useState('');
  const [adminPcId, setAdminPcId] = useState('');
  const [cameraId, setCameraId] = useState('');

  useEffect(() => {
    if (centres.length && !centreId) setCentreId(centres[0].id);
    if (lines.length && !lineId) setLineId(lines[0].id);
    if (adminPcs.length && !adminPcId) setAdminPcId(adminPcs[0].id);
    if (cameras.length && !cameraId) setCameraId(cameras[0].id);
    if (paymentModes.length && !paymentMode) setPaymentMode(paymentModes[0].name);
  }, [centres, lines, adminPcs, cameras, paymentModes, centreId, lineId, adminPcId, cameraId, paymentMode]);

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intake.customerId || !intake.vehicleRecordId) {
      toast.error('Complete appointment walk-in first (customer & vehicle IDs required)');
      return;
    }

    const grandTotal = parseFloat(totalAmount) || 0;
    const created = await paymentsApi.createPayment({
      customer_id: intake.customerId,
      vehicle_record_id: intake.vehicleRecordId,
      appointment_id: intake.appointmentId,
      anpr_capture_id: intake.anprCaptureId,
      centre_id: centreId || undefined,
      line_id: lineId || undefined,
      admin_pc_id: adminPcId || undefined,
      camera_id: cameraId || undefined,
      payment_type: paymentMode,
      status: 'Paid',
      charges: parseFloat(charges) || grandTotal,
      vat: parseFloat(vat) || 0,
      grand_total: grandTotal,
      pay_date: new Date().toISOString(),
      auto_create_job: true,
      job_source: 'Walk-In',
    });

    if (created) {
      intake.setFromPayment(created);
      toast.success(created.job_id ? `Payment recorded — job ${created.job_id}` : 'Payment recorded');
      setShowNewModal(false);
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

  const paginatedPayments = filteredPayments;

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex border-b border-gray-200 mb-6 bg-white px-5 pt-3 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]" style={{ margin: '-2px 20px 20px 20px', padding: '12px 24px 0 24px' }}>
        {(['Payments', 'Vehicle Records', 'Customers', 'File Processing', 'ROP Management'] as const).map((tab) => {
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-5 pb-3.5 text-sm font-semibold transition-all cursor-pointer relative -mb-px ${
                isActive ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
              }`}
              style={{ borderBottom: isActive ? '3px solid #1c1c1e' : '3px solid transparent' }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {activeSubTab === 'Payments' && (
        <div className="flex flex-col gap-4 min-h-full" style={{ marginLeft: '20px', marginRight: '20px', marginTop: '6px' }}>
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
                  onChange={(e) => { paymentsApi.setSearchQuery(e.target.value); paymentsApi.setPage(1); }}
                  className="bg-white transition-all focus:outline-none focus:border-gray-400"
                  style={{ width: '320px', height: '38px', border: '1px solid #cbd5e1', borderRadius: '10px', paddingLeft: '40px', paddingRight: '16px', fontSize: '14px', color: '#1e293b', boxSizing: 'border-box' }}
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
                      { label: 'External API', value: 'External API' }
                    ],
                    value: activeFilters.mode
                  },
                  {
                    id: 'type',
                    label: 'Payment Type',
                    type: 'select',
                    selectType: 'multiple',
                    options: [
                      { label: 'Standard', value: 'Standard' },
                      { label: 'Premium', value: 'Premium' },
                      { label: 'FOC', value: 'FOC' }
                    ],
                    value: activeFilters.type
                  }
                ]}
                onChange={(updated) => {
                  setActiveFilters(updated);
                  paymentsApi.setPage(1);
                }}
              />
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="transition-all cursor-pointer hover:bg-opacity-95"
              style={{ backgroundColor: '#1c1c1e', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', height: '38px' }}
            >
              <span style={{ fontSize: '18px', fontWeight: '400', lineHeight: '1', display: 'inline-block', position: 'relative', top: '-1px' }}>+</span>
              <span>New Transaction</span>
            </button>
          </div>

          <div className="w-full overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <table className="w-full text-left border-collapse min-w-200">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap cursor-pointer select-none" style={{ padding: '12px 20px' }}>
                      <div className="flex items-center gap-1">
                        Transaction ID
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Customer</th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Vehicle</th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Total</th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Mode</th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsApi.isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">Loading…</td>
                    </tr>
                  ) : paginatedPayments.length > 0 ? (
                    paginatedPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b border-gray-100 transition-colors duration-150 cursor-pointer hover:bg-gray-50 bg-white"
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 underline">
                          {payment.displayId}
                        </td>
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
              {/* Pagination Footer */}
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
      )}

      {activeSubTab === 'Vehicle Records' && <VehicleRecordsPage />}
      {activeSubTab === 'Customers' && <CustomersPage />}
      {activeSubTab === 'File Processing' && <FileProcessingPage />}
      {activeSubTab === 'ROP Management' && <RopManagementPage />}

      {/* MODAL: New Transaction Entry Form */}
      {showNewModal && activeSubTab === 'Payments' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 transition-all" style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
          <div
            style={{
              width: '460px',
              maxWidth: '95%',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '24px 28px',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              border: '1px solid #f3f4f6'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>New Transaction</h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  border: '1.5px solid #6b7280',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  color: '#4b5563'
                }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                Customer: {intake.customerId ? '✓' : '—'} · Vehicle: {intake.vehicleRecordId ? '✓' : '—'} ·
                Plate: {intake.plateNumber ?? '—'}
              </p>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Payment mode</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  {paymentModes.map((m) => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                  {!paymentModes.length && <option value="Cash">Cash</option>}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Grand total (OMR)</label>
                <input
                  type="number"
                  step="0.01"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {/* Mode */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>

                  {/* Cash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMode('Cash')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px 8px',
                      borderRadius: '10px',
                      border: paymentMode === 'Cash' ? '1.5px solid #d1d5db' : '1px solid #e5e7eb',
                      backgroundColor: paymentMode === 'Cash' ? '#e5e7eb' : '#ffffff',
                      color: paymentMode === 'Cash' ? '#111827' : '#4b5563',
                      fontWeight: paymentMode === 'Cash' ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ marginBottom: '2px' }}>
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="M6 10h.01M18 14h.01" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: '12px' }}>Cash</span>
                  </button>

                  {/* UPI */}
                  <button
                    type="button"
                    onClick={() => setPaymentMode('UPI')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px 8px',
                      borderRadius: '10px',
                      border: paymentMode === 'UPI' ? '1.5px solid #d1d5db' : '1px solid #e5e7eb',
                      backgroundColor: paymentMode === 'UPI' ? '#e5e7eb' : '#ffffff',
                      color: paymentMode === 'UPI' ? '#111827' : '#4b5563',
                      fontWeight: paymentMode === 'UPI' ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ marginBottom: '2px' }}>
                      <rect x="7" y="2" width="10" height="20" rx="2" />
                      <path d="M11 5h2M12 19v.01" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: '12px' }}>UPI</span>
                  </button>

                  {/* External API */}
                  <button
                    type="button"
                    onClick={() => setPaymentMode('External API')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px 8px',
                      borderRadius: '10px',
                      border: paymentMode === 'External API' ? '1.5px solid #d1d5db' : '1px solid #e5e7eb',
                      backgroundColor: paymentMode === 'External API' ? '#e5e7eb' : '#ffffff',
                      color: paymentMode === 'External API' ? '#111827' : '#4b5563',
                      fontWeight: paymentMode === 'External API' ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ marginBottom: '2px' }}>
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 10h18M7 15h.01M11 15h2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: '12px' }}>External API</span>
                  </button>

                </div>
              </div>

              {/* Confirm Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    color: '#4b5563',
                    fontWeight: 600,
                    fontSize: '13px',
                    padding: '10px 0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Proceed to Job
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    backgroundColor: '#1c1c1e',
                    border: '1px solid #1c1c1e',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '13px',
                    padding: '10px 0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Confirm Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
