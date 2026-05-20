import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import AppointmentsPage from '../appointments/AppointmentsPage';

interface VehicleRecord {
  plate: string;
  type: string;
  stage: string;
  waiting: string;
  priority: 'High' | 'Low';
}

interface SystemService {
  name: string;
  description: string;
  details: string;
  icon: React.ReactNode;
}

interface LineStatus {
  name: string;
  inProgress: number;
}

const DashboardPage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const stats = [
    { title: 'Vehicles Today', value: 184 },
    { title: 'Pass', value: 184 },
    { title: 'Fail', value: 184 },
    { title: 'In-Progress', value: 184 },
  ];

  const vehicles: VehicleRecord[] = [
    { plate: 'M-12345', type: 'Sedan', stage: 'Emissions', waiting: '12m', priority: 'High' },
    { plate: 'M-12345', type: 'Sedan', stage: 'Emissions', waiting: '12m', priority: 'High' },
    { plate: 'M-12345', type: 'Sedan', stage: 'Emissions', waiting: '12m', priority: 'Low' },
    { plate: 'M-12345', type: 'Sedan', stage: 'Emissions', waiting: '12m', priority: 'Low' },
    { plate: 'M-12345', type: 'Sedan', stage: 'Emissions', waiting: '12m', priority: 'Low' },
    { plate: 'M-12345', type: 'Sedan', stage: 'Emissions', waiting: '12m', priority: 'Low' },
  ];

  const lines: LineStatus[] = [
    { name: 'Line 1', inProgress: 10 },
    { name: 'Line 2', inProgress: 10 },
    { name: 'Line 3', inProgress: 10 },
    { name: 'Line 4', inProgress: 10 },
  ];

  const systemServices: SystemService[] = [
    {
      name: 'Database',
      description: 'Connected',
      details: 'Primary',
      icon: (
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
    },
    {
      name: 'ANPR Service',
      description: 'Unknown',
      details: 'Check Logs',
      icon: (
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      name: 'ROP API',
      description: 'Idle',
      details: 'Awaiting Requests',
      icon: (
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8.5 14.5a5 5 0 017 0M5.5 11.5a9 9 0 0113 0" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-white font-sans antialiased text-[#222]">
      {/* Sidebar Navigation */}
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      {/* Main content scroll container */}
      <main className="flex-1 bg-white px-6 py-4 overflow-y-auto" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        <div className="w-full">
          {activeMenu === 'Appointments' ? (
            <AppointmentsPage />
          ) : (
            <>
              {/* Header Bar */}
          <div className="flex justify-end mb-3">
            <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" />
              </svg>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-3" style={{ marginLeft: '20px', marginRight: '20px' }}>
            {stats.map((item) => (
              <div
                key={item.title}
                className="bg-[#F6F8F9] shadow-sm rounded-[16px] overflow-hidden flex flex-col justify-between min-h-[118px]"
              >
                <div className="px-5 pt-4 pb-3" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                  <p className="text-[24px] text-[#282828] font-medium tracking-tight">
                    {item.title}
                  </p>
                  <h2 className="text-[28px] font-bold text-[#282828] mt-1.5 tracking-tight leading-none">
                    {item.value}
                  </h2>
                </div>

                <div className="border-t border-neutral-200/60 px-5 py-2.5 flex justify-between items-center bg-[#F6F8F9] text-[14px]" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                  <span className="text-[#334155] font-medium h-10 ">
                    yesterday-130
                  </span>
                  <span className="flex items-center gap-1.5 text-[#334155] font-bold">
                    <svg className="w-5 h-5 text-[#2B8A3E]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      {/* L-shaped corner axis */}
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v3a1 1 0 001 1h3" />
                      {/* Upward trend curve with arrow */}
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 15l4-4 4 4 5-5M21 7h-4m4 0v4" />
                    </svg>
                    +12%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Split Layout */}
          <div className="grid grid-cols-[1fr_260px] gap-4 items-start" style={{ marginLeft: '20px', marginRight: '20px' }}>
            {/* Left Split - Pending Vehicle Monitoring Table */}
            <div>
              <div className="mb-2">
                <h2 className="text-[15px] font-semibold text-[#222]">
                  Pending Vehicle Monitoring
                </h2>
                <p className="text-[12px] text-gray-500 mt-0.5">
                  6 vehicles awaiting next stage · 2 high priority
                </p>
              </div>

              <div className="bg-white shadow-sm rounded-[10px] overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#F9FAFB] border-b border-neutral-100">
                    <tr>
                      <th className="px-5 py-3 text-[12px] text-gray-500 font-medium" style={{ padding: '12px 20px' }}>
                        <span className="inline-flex items-center gap-0.5 font-semibold">
                          Plate
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </th>
                      <th className="px-5 py-3 text-[12px] text-gray-500 font-semibold" style={{ padding: '12px 20px' }}>Type</th>
                      <th className="px-5 py-3 text-[12px] text-gray-500 font-semibold" style={{ padding: '12px 20px' }}>Stage</th>
                      <th className="px-5 py-3 text-[12px] text-gray-500 font-semibold" style={{ padding: '12px 20px' }}>Waiting</th>
                      <th className="px-5 py-3 text-[12px] text-gray-500 font-semibold" style={{ padding: '12px 20px' }}>Priority</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#dddddd]">
                    {vehicles.map((item, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="px-5 py-4 text-[13px] font-bold text-[#222] underline cursor-pointer hover:text-blue-600 transition-colors" style={{ padding: '16px 20px' }}>
                          {item.plate}
                        </td>
                        <td className="px-5 py-4 text-[13px] text-gray-600 font-medium" style={{ padding: '16px 20px' }}>{item.type}</td>
                        <td className="px-5 py-4 text-[13px] text-gray-600 font-medium" style={{ padding: '16px 20px' }}>{item.stage}</td>
                        <td className="px-5 py-4 text-[13px] text-gray-600 font-medium" style={{ padding: '16px 20px' }}>{item.waiting}</td>
                        <td className="px-5 py-4" style={{ padding: '16px 20px' }}>
                          <span
                            className={`inline-flex items-center px-2 py-[3px] rounded-full text-[11px] font-semibold tracking-wide border ${
                              item.priority === 'High'
                                ? 'bg-[#ffdede] border-[#ffd0d0] text-[#db4d4d]'
                                : 'bg-[#def5e5] border-[#d2edd9] text-[#25a35a]'
                            }`}
                          >
                            {item.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Split - Camera Status, System Health, Line Table */}
            <div className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Camera Status Card */}
              <div 
                className="bg-[#F6F8F9] shadow-sm rounded-[16px] overflow-hidden flex flex-col justify-between min-h-[118px]"
                style={{ marginTop: '34px' }}
              >
                <div className="px-5 pt-4 pb-3" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                  <p className="text-[24px] text-[#282828] font-medium tracking-tight">
                    Camera Status
                  </p>
                  <h2 className="text-[28px] font-bold text-[#282828] mt-1.5 tracking-tight leading-none">
                    10/15
                  </h2>
                </div>
                <div 
                  className="border-t border-neutral-200/60 px-5 py-2.5 flex justify-between items-center bg-[#F6F8F9] text-[14px]" 
                  style={{ paddingLeft: '20px', paddingRight: '20px' }}
                >
                  <span className="text-[#334155] font-medium h-10 flex items-center">
                    Active
                  </span>
                  <span className="flex items-center gap-1.5 text-[#334155] font-bold">
                    10
                  </span>
                </div>
              </div>

              {/* System Health */}
              <div>
                <h2 className="text-[15px] font-semibold text-[#222]" style={{ marginBottom: '10px' }}>
                  System Health
                </h2>
                <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {systemServices.map((svc) => (
                    <div
                      key={svc.name}
                      className="bg-white rounded-[10px] flex items-center justify-between hover:bg-neutral-50/50 transition-colors shadow-sm"
                      style={{ 
                        border: '1px solid #e2e8f0', 
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', 
                        borderRadius: '10px', 
                        padding: '12px 16px', 
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <p className="text-[13px] font-bold text-[#222] leading-tight">
                          {svc.name}
                        </p>
                        <p className="text-[12px] text-gray-600 mt-0.5 font-medium">
                          {svc.description} · {svc.details}
                        </p>
                      </div>
                      
                      <div 
                        className="rounded-md border border-[#cccccc] bg-[#f7f7f7]" 
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '6px', 
                          border: '1px solid #e2e8f0', 
                          backgroundColor: '#f8fafc', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {svc.icon}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Line Table */}
              <div>
                <h2 className="text-[15px] font-semibold text-[#222]" style={{ marginBottom: '10px' }}>
                  Line
                </h2>
                <div 
                  className="bg-white shadow-sm rounded-[10px] overflow-hidden"
                  style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#ffffff' }}
                >
                  <table className="w-full text-left border-collapse" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead className="bg-[#F9FAFB] border-b border-neutral-100" style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #f1f5f9' }}>
                      <tr>
                        <th className="px-5 py-3 text-[12px] text-gray-500 font-medium" style={{ padding: '12px 20px', textAlign: 'left' }}>
                          <span className="inline-flex items-center gap-0.5 font-semibold" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                            Line Name
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: '12px', height: '12px', color: '#9ca3af' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        </th>
                        <th className="px-5 py-3 text-right text-[12px] text-gray-500 font-semibold pr-6" style={{ padding: '12px 20px', paddingRight: '24px', textAlign: 'right' }}>In Progress</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#dddddd]">
                      {lines.map((line, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50/50 transition-colors" style={{ borderBottom: idx < lines.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                          <td className="px-5 py-4 text-[13px] font-bold text-[#222]" style={{ padding: '16px 20px', textAlign: 'left' }}>{line.name}</td>
                          <td className="px-5 py-4 text-right text-[13px] text-gray-600 font-bold pr-6" style={{ padding: '16px 20px', paddingRight: '24px', textAlign: 'right' }}>{line.inProgress}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      </div>
      </main>
      </div>
  );
};

export default DashboardPage;