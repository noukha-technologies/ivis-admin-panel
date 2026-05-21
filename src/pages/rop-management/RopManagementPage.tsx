import React, { useState } from 'react';

const RopManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Vehicle Fetch (6)');
  const [searchQuery, setSearchQuery] = useState('');

  const tableData = [
    {
      id: 'JOB-2000',
      time: '2026-05-05 10:00',
      message: 'OK - 200',
      status: 'Success'
    }
  ];

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
              onClick={() => setActiveTab('Vehicle Fetch (6)')}
              className={`px-4 py-2 text-sm transition-all duration-200 border-r border-gray-200 ${
                activeTab === 'Vehicle Fetch (6)'
                  ? 'font-semibold text-gray-900 bg-gray-50'
                  : 'font-medium text-gray-500 bg-white hover:bg-gray-50'
              }`}
            >
              Vehicle Fetch (6)
            </button>
            <button
              onClick={() => setActiveTab('Job Submission (6)')}
              className={`px-4 py-2 text-sm transition-all duration-200 ${
                activeTab === 'Job Submission (6)'
                  ? 'font-semibold text-gray-900 bg-gray-50'
                  : 'font-medium text-gray-500 bg-white hover:bg-gray-50'
              }`}
            >
              Job Submission (6)
            </button>
          </div>

          {/* Filter Dropdown */}
          <div className="relative flex items-center w-[160px]">
            <select
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
              <option>All</option>
              <option>Success</option>
              <option>Failed</option>
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
                <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap cursor-pointer select-none">
                  <div className="flex items-center gap-1">
                    Job ID
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Request Time</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Response Message</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 transition-colors duration-150 hover:bg-gray-50 bg-white"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.time}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.message}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-[#ecfdf5] text-[#059669] border border-[#d1fae5]">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default RopManagementPage;
