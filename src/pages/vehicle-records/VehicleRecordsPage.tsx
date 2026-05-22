import React, { useState } from 'react';

interface VehicleRecord {
  id: string;
  plate: string;
  captureTime: string;
  cameraId: string;
  confidence: string;
  status: 'Validated' | 'Pending' | 'Rejected';
}

const VehicleRecordsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ANPR capture' | 'ROP verification'>('ANPR capture');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const [records, setRecords] = useState<VehicleRecord[]>([
    {
      id: '1',
      plate: 'OM-1024',
      captureTime: '2026-05-05 10:32',
      cameraId: 'CAM-02',
      confidence: '98.4%',
      status: 'Validated'
    },
    {
      id: '2',
      plate: 'OM-4930',
      captureTime: '2026-05-05 10:45',
      cameraId: 'CAM-01',
      confidence: '95.1%',
      status: 'Validated'
    },
    {
      id: '3',
      plate: 'OM-8812',
      captureTime: '2026-05-05 11:02',
      cameraId: 'CAM-03',
      confidence: '99.2%',
      status: 'Validated'
    },
    {
      id: '4',
      plate: 'OM-2033',
      captureTime: '2026-05-05 11:15',
      cameraId: 'CAM-02',
      confidence: '91.5%',
      status: 'Validated'
    },
    {
      id: '5',
      plate: 'OM-7721',
      captureTime: '2026-05-05 11:30',
      cameraId: 'CAM-01',
      confidence: '88.7%',
      status: 'Pending'
    },
    {
      id: '6',
      plate: 'OM-1928',
      captureTime: '2026-05-05 11:45',
      cameraId: 'CAM-03',
      confidence: '97.6%',
      status: 'Validated'
    },
    {
      id: '7',
      plate: 'OM-3044',
      captureTime: '2026-05-05 12:05',
      cameraId: 'CAM-02',
      confidence: '94.8%',
      status: 'Validated'
    },
    {
      id: '8',
      plate: 'OM-9081',
      captureTime: '2026-05-05 12:20',
      cameraId: 'CAM-01',
      confidence: '76.2%',
      status: 'Rejected'
    },
    {
      id: '9',
      plate: 'OM-6677',
      captureTime: '2026-05-05 12:40',
      cameraId: 'CAM-03',
      confidence: '99.5%',
      status: 'Validated'
    },
    {
      id: '10',
      plate: 'OM-5522',
      captureTime: '2026-05-05 13:10',
      cameraId: 'CAM-02',
      confidence: '92.3%',
      status: 'Validated'
    },
    {
      id: '11',
      plate: 'OM-4110',
      captureTime: '2026-05-05 13:30',
      cameraId: 'CAM-01',
      confidence: '89.1%',
      status: 'Pending'
    },
    {
      id: '12',
      plate: 'OM-3301',
      captureTime: '2026-05-05 13:55',
      cameraId: 'CAM-03',
      confidence: '96.4%',
      status: 'Validated'
    }
  ]);

  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  React.useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdownId(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const filteredRecords = records.filter(r => 
    r.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cameraId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="flex flex-col gap-4 min-h-full" style={{ marginLeft: '20px', marginRight: '20px', marginTop: '6px' }}>

      {/* Top Controls Bar */}
      <div className="flex justify-between items-center" style={{ minHeight: '38px' }}>
        
        {/* Left Side: Search */}
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

        {/* Right Side: Tabs */}
        <div className="flex flex-row bg-white rounded-lg border border-gray-200 overflow-hidden">
          <button
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

      {/* Main Container */}
      <div className="w-full overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[600px]">
            {activeTab === 'ANPR capture' ? (
              <>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>
                      <div className="flex items-center gap-1">
                        Plate
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Capture Time</th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Camera ID</th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Confidence</th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Status</th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.length > 0 ? (
                    paginatedRecords.map((record) => {
                      const badgeClass = record.status === 'Validated'
                        ? 'bg-[#ecfdf5] text-[#027a48] border-[#d1fae5]'
                        : record.status === 'Pending'
                          ? 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]'
                          : 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]/60';
                      return (
                        <tr key={record.id} className="border-b border-gray-100 transition-colors duration-150 cursor-pointer hover:bg-gray-50 bg-white">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            {record.plate}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {record.captureTime}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {record.cameraId}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {record.confidence}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-[8px] text-[12.5px] font-semibold border select-none ${badgeClass}`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 relative" onClick={(e) => e.stopPropagation()}>
                            <div className="relative inline-block text-left">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdownId(activeDropdownId === record.id ? null : record.id);
                                }}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                              </button>

                              {activeDropdownId === record.id && (
                                <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 font-semibold text-[13px] text-gray-700">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      alert(`Viewing record for plate ${record.plate}`);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5 transition-colors text-slate-700"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      alert(`Editing record for plate ${record.plate}`);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5 transition-colors text-slate-700"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm(`Are you sure you want to delete record ${record.plate}?`)) {
                                        setRecords(records.filter((r) => r.id !== record.id));
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
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>
                      <div className="flex items-center gap-1">
                        Owner
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Make</th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Model</th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Reg No</th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Chassis No</th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Insurance</th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Reg Expiry</th>
                    <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Fetch Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 bg-white">
                    <td colSpan={8} className="px-6 py-6 text-sm text-gray-500 font-medium text-center">
                      Vehicle details not fetched yet. Click "Fetch Vehicle Details from ROP"
                    </td>
                  </tr>
                </tbody>
              </>
            )}
          </table>
          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-white">
            <span className="text-[13px] text-slate-500 font-medium">
              Page {currentPage} of {Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE))} · {filteredRecords.length} Records
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
                onClick={() => setCurrentPage((p) => Math.min(Math.ceil(filteredRecords.length / PAGE_SIZE), p + 1))}
                disabled={currentPage >= Math.ceil(filteredRecords.length / PAGE_SIZE)}
                className={`px-4 py-1.5 text-[13px] font-medium border border-slate-300 rounded-lg bg-white transition-all duration-150 ${currentPage >= Math.ceil(filteredRecords.length / PAGE_SIZE) ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default VehicleRecordsPage;
