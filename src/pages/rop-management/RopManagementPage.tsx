import React, { useState } from 'react';

const RopManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Vehicle Fetch' | 'Job Submission'>('Vehicle Fetch');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const [vehicleFetchList, setVehicleFetchList] = useState([
    { id: 'JOB-2001', time: '2026-05-22 10:15', message: 'OK - 200 (Vehicle records synced successfully)', status: 'Success' },
    { id: 'JOB-2002', time: '2026-05-22 10:30', message: 'OK - 200 (Plate ROP query completed)', status: 'Success' },
    { id: 'JOB-2003', time: '2026-05-22 10:45', message: '404 - Vehicle plate registration not found in ROP database', status: 'Failed' },
    { id: 'JOB-2004', time: '2026-05-22 11:00', message: 'OK - 200 (Chassis validation complete)', status: 'Success' },
    { id: 'JOB-2005', time: '2026-05-22 11:10', message: '503 - ROP server temporarily unavailable, timeout occurred', status: 'Failed' },
    { id: 'JOB-2006', time: '2026-05-22 11:20', message: 'OK - 200 (Profile details matched with owner ID)', status: 'Success' },
    { id: 'JOB-2007', time: '2026-05-22 11:25', message: '400 - Invalid Omani plate format provided in query parameters', status: 'Failed' },
    { id: 'JOB-2008', time: '2026-05-22 11:32', message: 'OK - 200 (Successfully fetched insurance status)', status: 'Success' },
    { id: 'JOB-2009', time: '2026-05-22 11:35', message: 'OK - 200 (Export approval confirmed)', status: 'Success' },
    { id: 'JOB-2010', time: '2026-05-22 11:40', message: 'OK - 200 (Owner vehicle logs fetched)', status: 'Success' },
    { id: 'JOB-2011', time: '2026-05-22 11:42', message: '403 - API key mismatch or invalid scope for query', status: 'Failed' },
    { id: 'JOB-2012', time: '2026-05-22 11:45', message: 'OK - 200 (Vehicle color and details verified)', status: 'Success' },
  ]);

  const [jobSubmissionList, setJobSubmissionList] = useState([
    { id: 'JOB-3001', time: '2026-05-22 10:20', message: 'OK - 201 (Inspection certificate uploaded and saved)', status: 'Success' },
    { id: 'JOB-3002', time: '2026-05-22 10:35', message: 'OK - 201 (Emissions record submitted successfully)', status: 'Success' },
    { id: 'JOB-3003', time: '2026-05-22 10:50', message: '500 - Database write failed for inspection job OUT_JOB-3003', status: 'Failed' },
    { id: 'JOB-3004', time: '2026-05-22 11:05', message: 'OK - 201 (Visual inspection photo submitted)', status: 'Success' },
    { id: 'JOB-3005', time: '2026-05-22 11:15', message: 'OK - 201 (Full inspection certificate sent to ROP)', status: 'Success' },
    { id: 'JOB-3006', time: '2026-05-22 11:18', message: '422 - Validation failed: Missing brake test readings in file', status: 'Failed' },
    { id: 'JOB-3007', time: '2026-05-22 11:24', message: 'OK - 201 (Re-test results uploaded)', status: 'Success' },
    { id: 'JOB-3008', time: '2026-05-22 11:28', message: 'OK - 201 (Safety clearance logs saved)', status: 'Success' },
    { id: 'JOB-3009', time: '2026-05-22 11:36', message: 'OK - 201 (Inspection checkpoint status submitted)', status: 'Success' },
    { id: 'JOB-3010', time: '2026-05-22 11:39', message: 'OK - 201 (Tyre health readings registered)', status: 'Success' },
    { id: 'JOB-3011', time: '2026-05-22 11:41', message: '409 - Duplicate submission for inspection certificate', status: 'Failed' },
    { id: 'JOB-3012', time: '2026-05-22 11:44', message: 'OK - 201 (Suspension diagnostics saved)', status: 'Success' },
  ]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, activeTab]);

  const rawData = activeTab === 'Vehicle Fetch' ? vehicleFetchList : jobSubmissionList;
  const filteredData = rawData.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.time.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedData = filteredData.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4 min-h-full" style={{ marginLeft: '20px', marginRight: '20px', marginTop: '6px' }}>

      {/* Top Controls Bar */}
      <div className="flex justify-between items-center" style={{ minHeight: '38px' }}>
        
        {/* Left Side: Search Input */}
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white transition-all focus:outline-none focus:border-gray-400"
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

        {/* Right Side: Controls (Tabs & Filter) */}
        <div className="flex items-center gap-4">
          {/* Tabs */}
          <div className="flex flex-row bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setActiveTab('Vehicle Fetch')}
              className={`px-4 py-2 text-sm transition-all duration-200 border-r border-gray-200 ${
                activeTab === 'Vehicle Fetch'
                  ? 'font-semibold text-gray-900 bg-gray-50 bg-none'
                  : 'font-medium text-gray-500 bg-white hover:bg-gray-50 bg-none'
              }`}
            >
              Vehicle Fetch ({vehicleFetchList.length})
            </button>
            <button
              onClick={() => setActiveTab('Job Submission')}
              className={`px-4 py-2 text-sm transition-all duration-200 ${
                activeTab === 'Job Submission'
                  ? 'font-semibold text-gray-900 bg-gray-50 bg-none'
                  : 'font-medium text-gray-500 bg-white hover:bg-gray-50 bg-none'
              }`}
            >
              Job Submission ({jobSubmissionList.length})
            </button>
          </div>

          {/* Filter Dropdown */}
          <div className="relative flex items-center w-[160px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white transition-all outline-none focus:border-gray-400 pl-4 pr-10 appearance-none cursor-pointer"
              style={{
                height: '38px',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                fontSize: '14px',
                color: '#1e293b',
                boxSizing: 'border-box'
              }}
            >
              <option value="All">All</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#64748b]">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap cursor-pointer select-none" style={{ padding: '12px 20px' }}>
                  <div className="flex items-center gap-1">
                    Job ID
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Request Time</th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Response Message</th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Status</th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap w-12 text-right" style={{ padding: '12px 20px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 transition-colors duration-150 hover:bg-gray-50 bg-white"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.time}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.message}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-[8px] text-[12.5px] font-semibold border select-none ${
                        item.status === 'Success'
                          ? 'bg-[#ecfdf5] text-[#027a48] border-[#d1fae5]'
                          : 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]/60'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block text-left">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(activeDropdownId === item.id ? null : item.id);
                          }}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center ml-auto"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>

                        {activeDropdownId === item.id && (
                          <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 font-semibold text-[13px] text-gray-700 text-left">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Viewing transaction: ${item.id}`);
                                setActiveDropdownId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5 transition-colors text-slate-700"
                            >
                              View Details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Re-submitting transaction request for: ${item.id}`);
                                setActiveDropdownId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5 transition-colors text-slate-700"
                            >
                              Resubmit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Are you sure you want to delete transaction ${item.id}?`)) {
                                  if (activeTab === 'Vehicle Fetch') {
                                    setVehicleFetchList(vehicleFetchList.filter(v => v.id !== item.id));
                                  } else {
                                    setJobSubmissionList(jobSubmissionList.filter(j => j.id !== item.id));
                                  }
                                }
                                setActiveDropdownId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-1.5 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 font-medium bg-white">
                    No ROP transaction records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-white">
            <span className="text-[13px] text-slate-500 font-medium">
              Page {currentPage} of {Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE))} · {filteredData.length} Records
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
                onClick={() => setCurrentPage((p) => Math.min(Math.ceil(filteredData.length / PAGE_SIZE), p + 1))}
                disabled={currentPage >= Math.ceil(filteredData.length / PAGE_SIZE)}
                className={`px-4 py-1.5 text-[13px] font-medium border border-slate-300 rounded-lg bg-white transition-all duration-150 ${currentPage >= Math.ceil(filteredData.length / PAGE_SIZE) ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default RopManagementPage;
