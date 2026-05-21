import React, { useState } from 'react';

const CustomersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

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
            onChange={(e) => setSearchQuery(e.target.value)}
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
        <div></div>
      </div>

      {/* Main Container */}
      <div className="w-full overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    Customer
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Phone</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">ID Number</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Plate</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Chassis</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Vehicle</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap w-12">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 transition-colors duration-150 cursor-pointer hover:bg-gray-50 bg-white">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">Ahmed Al-Said</td>
                <td className="px-6 py-4 text-sm text-gray-500">+968 91000000</td>
                <td className="px-6 py-4 text-sm text-gray-500">ID20000000</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">OM-1000</td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">JT2BF22K0W0123456</td>
                <td className="px-6 py-4 text-sm text-gray-500">Sedan</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default CustomersPage;
