import React, { useState } from 'react';

interface PaymentRecord {
  id: string;
  customer: string;
  vehicle: string;
  total: string;
  mode: string;
  type: string;
}

const PaymentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Form states for New Payment modal
  const [customerName, setCustomerName] = useState('');
  const [vehicleNo, setVehicleNo] = useState('OM-1000');
  const [totalAmount, setTotalAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentType, setPaymentType] = useState('FOC');

  const [payments, setPayments] = useState<PaymentRecord[]>([
    {
      id: '#240526-01',
      customer: 'Ahmed',
      vehicle: 'OM-1000',
      total: 'OMR 26.25',
      mode: 'Cash',
      type: 'FOC'
    },
    {
      id: '#240526-02',
      customer: 'Salim Al-Harthy',
      vehicle: 'OM-4930',
      total: 'OMR 15.00',
      mode: 'Card',
      type: 'Standard'
    },
    {
      id: '#240526-03',
      customer: 'Fatima Al-Balushi',
      vehicle: 'OM-8812',
      total: 'OMR 30.00',
      mode: 'Card',
      type: 'Premium'
    },
    {
      id: '#240526-04',
      customer: 'John Doe',
      vehicle: 'OM-2033',
      total: 'OMR 26.25',
      mode: 'Cash',
      type: 'FOC'
    },
    {
      id: '#240526-05',
      customer: 'Khalid Al-Riyami',
      vehicle: 'OM-7721',
      total: 'OMR 15.00',
      mode: 'Cash',
      type: 'Standard'
    },
    {
      id: '#240526-06',
      customer: 'Mazin Al-Sadi',
      vehicle: 'OM-1928',
      total: 'OMR 30.00',
      mode: 'Card',
      type: 'Premium'
    },
    {
      id: '#240526-07',
      customer: 'Said Al-Habsi',
      vehicle: 'OM-3044',
      total: 'OMR 26.25',
      mode: 'Cash',
      type: 'FOC'
    },
    {
      id: '#240526-08',
      customer: 'Amna Al-Jahwari',
      vehicle: 'OM-9081',
      total: 'OMR 15.00',
      mode: 'Card',
      type: 'Standard'
    },
    {
      id: '#240526-09',
      customer: 'Yahya Al-Kharusi',
      vehicle: 'OM-6677',
      total: 'OMR 30.00',
      mode: 'Cash',
      type: 'Premium'
    },
    {
      id: '#240526-10',
      customer: 'Mona Al-Farsi',
      vehicle: 'OM-5522',
      total: 'OMR 26.25',
      mode: 'Card',
      type: 'FOC'
    },
    {
      id: '#240526-11',
      customer: 'Hamed Al-Rawahi',
      vehicle: 'OM-4110',
      total: 'OMR 15.00',
      mode: 'Cash',
      type: 'Standard'
    }
  ]);

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !totalAmount) return;

    const newId = `#240526-${String(payments.length + 1).padStart(2, '0')}`;
    const newPayment: PaymentRecord = {
      id: newId,
      customer: customerName,
      vehicle: vehicleNo,
      total: `OMR ${parseFloat(totalAmount).toFixed(2)}`,
      mode: paymentMode,
      type: paymentType
    };

    setPayments([newPayment, ...payments]);
    setShowNewModal(false);

    // Reset fields
    setCustomerName('');
    setTotalAmount('');
    setPaymentMode('Cash');
    setPaymentType('FOC');
  };

  const filteredPayments = payments.filter(p => 
    p.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.mode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="flex flex-col gap-4 min-h-full" style={{ marginLeft: '20px', marginRight: '20px', marginTop: '6px' }}>
      {/* Top Controls Bar */}
      <div className="flex justify-between items-center" style={{ minHeight: '38px' }}>
        {/* Left Side: Search Bar */}
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
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
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
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Right Side: + New Payment Button */}
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
          <span>New Payment</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap cursor-pointer select-none" style={{ padding: '12px 20px' }}>
                  <div className="flex items-center gap-1">
                    Payment ID
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
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-100 transition-colors duration-150 cursor-pointer hover:bg-gray-50 bg-white"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 underline">
                      {payment.id}
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
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-white">
            <span className="text-[13px] text-slate-500 font-medium">
              Page {currentPage} of {Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE))} · {filteredPayments.length} Records
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-1.5 text-[13px] font-medium border border-slate-300 rounded-lg bg-white transition-all duration-150 ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(Math.ceil(filteredPayments.length / PAGE_SIZE), p + 1))}
                disabled={currentPage >= Math.ceil(filteredPayments.length / PAGE_SIZE)}
                className={`px-4 py-1.5 text-[13px] font-medium border border-slate-300 rounded-lg bg-white transition-all duration-150 ${currentPage >= Math.ceil(filteredPayments.length / PAGE_SIZE) ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>

      {/* MODAL: New Payment Entry Form */}
      {showNewModal && (
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
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>New Payment</h3>
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

              {/* Phone */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Phone *</label>
                <input
                  type="tel"
                  placeholder="Enter"
                  required
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: '#1f2937',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              {/* Customer Name */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Customer Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter"
                  required
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: '#1f2937',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              {/* Vehicle Number */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Vehicle Number *</label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  placeholder="Enter"
                  required
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: '#1f2937',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              {/* Amount (OMR) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Amount (OMR)</label>
                <input
                  type="number"
                  step="0.01"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="Enter"
                  required
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: '#1f2937',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              {/* Type */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Type</label>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', color: '#374151', fontWeight: 500, userSelect: 'none' }}>
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentType === 'Paid'}
                      onChange={() => setPaymentType('Paid')}
                      style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: '#4b5563' }}
                    />
                    Paid
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', color: '#374151', fontWeight: 500, userSelect: 'none' }}>
                    <input
                      type="radio"
                      name="paymentType"
                      checked={paymentType === 'FOC'}
                      onChange={() => setPaymentType('FOC')}
                      style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: '#4b5563' }}
                    />
                    FOC
                  </label>
                </div>
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
                  Confirm Payment
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
