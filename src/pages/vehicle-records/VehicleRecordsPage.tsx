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

  const records: VehicleRecord[] = [
    {
      id: '1',
      plate: 'OM-1024',
      captureTime: '2026-05-05 10:32',
      cameraId: 'CAM-02',
      confidence: '98.4%',
      status: 'Validated'
    }
  ];

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
                    <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        Plate
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Capture Time</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Camera ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Confidence</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
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
                        <span className="inline-flex items-center justify-center px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {/* Action buttons could go here */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        Owner
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Make</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Model</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Reg No</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Chassis No</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Insurance</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Reg Expiry</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#667085] whitespace-nowrap">Fetch Status</th>
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
        </div>
      </div>
  );
};

export default VehicleRecordsPage;
