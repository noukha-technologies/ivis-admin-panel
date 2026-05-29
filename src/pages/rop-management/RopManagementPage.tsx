import React, { useState } from 'react';
import { useRopVerifications } from '../../features/rop/hooks/useRopVerifications';

const RopManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Vehicle Fetch' | 'Job Submission'>('Vehicle Fetch');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const rop = useRopVerifications();

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, activeTab]);

  const rawData =
    activeTab === 'Vehicle Fetch'
      ? rop.items.map((item) => ({
          id: `ROP-${item.raw.rop_verification_id}`,
          time: item.raw.created_at.slice(0, 16).replace('T', ' '),
          message: `${item.fetchStatus} — ${item.regNo} (${item.owner})`,
          status: item.fetchStatus === 'Fetched' ? 'Success' : 'Failed',
        }))
      : [];

  const filteredData = rawData.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4 min-h-full" style={{ marginLeft: '20px', marginRight: '20px', marginTop: '6px' }}>
      <div className="flex justify-between items-center" style={{ minHeight: '38px' }}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={activeTab === 'Vehicle Fetch' ? rop.searchQuery : searchQuery}
            onChange={(e) => {
              if (activeTab === 'Vehicle Fetch') {
                rop.setSearchQuery(e.target.value);
              } else {
                setSearchQuery(e.target.value);
              }
            }}
            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm"
            style={{ width: '320px', height: '38px', paddingLeft: '40px' }}
          />
        </div>
        <div className="flex flex-row bg-white rounded-lg border border-gray-200 overflow-hidden">
          {(['Vehicle Fetch', 'Job Submission'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm ${activeTab === tab ? 'font-semibold bg-gray-50' : 'text-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {rop.error && <p className="text-sm text-red-600">{rop.error}</p>}

      <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-5 py-3 text-sm font-semibold text-gray-500">ID</th>
              <th className="px-5 py-3 text-sm font-semibold text-gray-500">Time</th>
              <th className="px-5 py-3 text-sm font-semibold text-gray-500">Message</th>
              <th className="px-5 py-3 text-sm font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {activeTab === 'Job Submission' ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                  Job submission to ROP is not available via API yet.
                </td>
              </tr>
            ) : rop.isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="px-6 py-4 text-sm font-semibold">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.time}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.message}</td>
                  <td className="px-6 py-4 text-sm">{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                  No ROP records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {activeTab === 'Vehicle Fetch' && (
          <div className="flex justify-between px-5 py-3 border-t text-sm text-gray-500">
            <span>
              Page {rop.page} of {rop.totalPages}
            </span>
            <div className="flex gap-2">
              <button type="button" onClick={() => rop.setPage((p) => Math.max(1, p - 1))} disabled={rop.page === 1}>
                Previous
              </button>
              <button
                type="button"
                onClick={() => rop.setPage((p) => Math.min(rop.totalPages, p + 1))}
                disabled={rop.page >= rop.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RopManagementPage;
