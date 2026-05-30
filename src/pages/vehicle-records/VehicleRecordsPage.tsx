import React, { useState } from 'react';
import { toast } from 'sonner';
import { buildAnprCapturePayload } from '@/features/anpr/buildAnprCapturePayload';
import { useAnprCaptures } from '../../features/anpr/hooks/useAnprCaptures';
import { useRopVerifications } from '../../features/rop/hooks/useRopVerifications';
import { useIntake } from '../../features/intake/IntakeContext';
import { useMasterLookups } from '../../hooks/useMasterLookups';

const VehicleRecordsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ANPR capture' | 'ROP verification'>('ANPR capture');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [plateNumber, setPlateNumber] = useState('');
  const [cameraId, setCameraId] = useState('');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const intake = useIntake();
  const { cameras } = useMasterLookups();
  const anpr = useAnprCaptures({ enabled: activeTab === 'ANPR capture' });
  const rop = useRopVerifications({ enabled: activeTab === 'ROP verification' });

  React.useEffect(() => {
    if (cameras.length && !cameraId) {
      setCameraId(cameras[0].id);
    }
  }, [cameras, cameraId]);

  React.useEffect(() => {
    const handleOutsideClick = () => setActiveDropdownId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleCreateCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber.trim() || !cameraId) {
      toast.error('Plate number and camera are required');
      return;
    }
    const created = await anpr.createCapture(buildAnprCapturePayload(plateNumber.trim(), cameraId));
    if (created) {
      intake.setFromAnpr(created);
      toast.success('ANPR capture created — ROP processed automatically');
      setShowCreateModal(false);
    } else if (anpr.error) {
      toast.error(anpr.error);
    }
  };

  const records = anpr.items;
  const ropItems = rop.items;

  return (
    <div className="flex flex-col gap-4 min-h-full" style={{ marginLeft: '20px', marginRight: '20px', marginTop: '6px' }}>
      <div className="flex justify-between items-center" style={{ minHeight: '38px' }}>
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
            value={activeTab === 'ANPR capture' ? anpr.searchQuery : rop.searchQuery}
            onChange={(e) => {
              if (activeTab === 'ANPR capture') {
                anpr.setSearchQuery(e.target.value);
                anpr.setPage(1);
              } else {
                rop.setSearchQuery(e.target.value);
                rop.setPage(1);
              }
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

        <div className="flex items-center gap-3">
          {activeTab === 'ANPR capture' && (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#1e293b] rounded-lg hover:bg-[#334155]"
            >
              New ANPR Capture
            </button>
          )}
          <div className="flex flex-row bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveTab('ANPR capture')}
              className={`px-4 py-2 text-sm transition-all duration-200 border-r border-gray-200 ${
                activeTab === 'ANPR capture'
                  ? 'font-semibold text-gray-900 bg-gray-50'
                  : 'font-medium text-gray-500 bg-white hover:bg-gray-50'
              }`}
            >
              ANPR capture
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ROP verification')}
              className={`px-4 py-2 text-sm transition-all duration-200 ${
                activeTab === 'ROP verification'
                  ? 'font-semibold text-gray-900 bg-gray-50'
                  : 'font-medium text-gray-500 bg-white hover:bg-gray-50'
              }`}
            >
              ROP verification
            </button>
          </div>
        </div>
      </div>

      {(anpr.error || rop.error) && (
        <p className="text-sm text-red-600 font-medium">{anpr.error || rop.error}</p>
      )}

      <div className="w-full overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[600px]">
          {activeTab === 'ANPR capture' ? (
            <>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold">Plate</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold">Capture Time</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold">Camera</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold">Confidence</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold">Status</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {anpr.isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                      Loading…
                    </td>
                  </tr>
                ) : records.length > 0 ? (
                  records.map((record) => {
                    const badgeClass =
                      record.status === 'Validated'
                        ? 'bg-[#ecfdf5] text-[#027a48] border-[#d1fae5]'
                        : record.status === 'Pending'
                          ? 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]'
                          : 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]/60';
                    return (
                      <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 bg-white">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{record.plate}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{record.captureTime}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{record.cameraId}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{record.confidence}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-[8px] text-[12.5px] font-semibold border ${badgeClass}`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownId(activeDropdownId === record.id ? null : record.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                          >
                            ⋮
                          </button>
                          {activeDropdownId === record.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 text-[13px]">
                              <button
                                type="button"
                                className="w-full text-left px-3 py-1.5 hover:bg-gray-50"
                                onClick={() => {
                                  intake.setFromAnpr(record.raw);
                                  toast.success('Capture linked to intake session');
                                  setActiveDropdownId(null);
                                }}
                              >
                                Use for intake
                              </button>
                              <button
                                type="button"
                                className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600"
                                onClick={async () => {
                                  if (window.confirm(`Delete capture ${record.plate}?`)) {
                                    const ok = await anpr.removeCapture(record.id);
                                    if (ok) toast.success('Deleted');
                                    else if (anpr.error) toast.error(anpr.error);
                                  }
                                  setActiveDropdownId(null);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </>
          ) : (
            <>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold">Owner</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold">Make</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold">Model</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold">Reg No</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold">Chassis No</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold">Fetch Status</th>
                </tr>
              </thead>
              <tbody>
                {rop.isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                      Loading…
                    </td>
                  </tr>
                ) : ropItems.length > 0 ? (
                  ropItems.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 bg-white hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{row.owner}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.make}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.model}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.regNo}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.chassisNo}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.fetchStatus}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-6 text-sm text-gray-500 text-center">
                      No ROP verifications yet. Create an ANPR capture with simulate ROP enabled.
                    </td>
                  </tr>
                )}
              </tbody>
            </>
          )}
        </table>
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-white">
          <span className="text-[13px] text-slate-500 font-medium">
            {activeTab === 'ANPR capture'
              ? `Page ${anpr.page} of ${anpr.totalPages} · ${anpr.total} records`
              : `Page ${rop.page} of ${rop.totalPages} · ${rop.total} records`}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                activeTab === 'ANPR capture'
                  ? anpr.setPage((p) => Math.max(1, p - 1))
                  : rop.setPage((p) => Math.max(1, p - 1))
              }
              disabled={activeTab === 'ANPR capture' ? anpr.page === 1 : rop.page === 1}
              className="px-4 py-1.5 text-[13px] font-medium border border-slate-300 rounded-lg bg-white disabled:text-slate-300"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() =>
                activeTab === 'ANPR capture'
                  ? anpr.setPage((p) => Math.min(anpr.totalPages, p + 1))
                  : rop.setPage((p) => Math.min(rop.totalPages, p + 1))
              }
              disabled={
                activeTab === 'ANPR capture'
                  ? anpr.page >= anpr.totalPages
                  : rop.page >= rop.totalPages
              }
              className="px-4 py-1.5 text-[13px] font-medium border border-slate-300 rounded-lg bg-white disabled:text-slate-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/35">
          <form
            onSubmit={handleCreateCapture}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">New ANPR Capture</h3>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Plate number</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              required
            />
            <label className="block text-sm font-semibold text-gray-600 mb-1">Camera</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 text-sm"
              value={cameraId}
              onChange={(e) => setCameraId(e.target.value)}
              required
            >
              {cameras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mb-4">Simulated ROP and vehicle record upsert will run automatically.</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={anpr.isSubmitting}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#1e293b] rounded-lg disabled:opacity-50"
              >
                {anpr.isSubmitting ? 'Creating…' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VehicleRecordsPage;
