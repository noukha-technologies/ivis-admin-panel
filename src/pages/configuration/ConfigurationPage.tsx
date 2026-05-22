import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const centers = [
  { id: 1, name: 'Bausher Inspection Center', code: 'CEN-001', region: 'Muscat', operatingHours: '08:00 - 18:00', adminPc: 4, lines: 6, cameras: 12 },
  { id: 2, name: 'Seeb Technical Center', code: 'CEN-002', region: 'Seeb', operatingHours: '08:00 - 18:00', adminPc: 3, lines: 4, cameras: 8 },
  { id: 3, name: 'Salalah Vehicle Testing', code: 'CEN-003', region: 'Salalah', operatingHours: '09:00 - 17:00', adminPc: 2, lines: 3, cameras: 6 },
  { id: 4, name: 'Sohar Inspection Hub', code: 'CEN-004', region: 'Sohar', operatingHours: '08:00 - 18:00', adminPc: 3, lines: 5, cameras: 10 },
];

const ConfigurationPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Configuration';
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);


  const CentersTable = () => (
    <div className="flex flex-col gap-4">
      {/* Toolbar: search + add button above the table */}
      <div className="flex items-center justify-between">
        <div className="relative w-[300px]">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search centers..."
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-[13px] focus:outline-none focus:border-neutral-400 bg-white"
          />
        </div>

      </div>

      {/* Table card */}
      <div className="bg-white border border-neutral-200/80 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/50 border-b border-neutral-200 text-[#64748b] text-[12px] uppercase font-bold tracking-wider">
              <th className="py-3.5 px-6 font-semibold">Center Name</th>
              <th className="py-3.5 px-6 font-semibold">Center Code</th>
              <th className="py-3.5 px-6 font-semibold">Region</th>
              <th className="py-3.5 px-6 font-semibold">Operating Hours</th>
              <th className="py-3.5 px-6 font-semibold whitespace-nowrap">No of Admin Pc</th>
              <th className="py-3.5 px-6 font-semibold whitespace-nowrap">No of Line</th>
              <th className="py-3.5 px-6 font-semibold whitespace-nowrap">No of Camera</th>
              <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {centers.map((center) => (
              <tr key={center.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="py-3.5 px-6 align-middle text-[14px] font-semibold text-gray-900">{center.name}</td>
                <td className="py-3.5 px-6 align-middle text-[13.5px] text-gray-600 font-mono">{center.code}</td>
                <td className="py-3.5 px-6 align-middle text-[13.5px] text-gray-600">{center.region}</td>
                <td className="py-3.5 px-6 align-middle text-[13.5px] text-gray-600">{center.operatingHours}</td>
                <td className="py-3.5 px-6 align-middle text-[13.5px] text-gray-600">{center.adminPc}</td>
                <td className="py-3.5 px-6 align-middle text-[13.5px] text-gray-600">{center.lines}</td>
                <td className="py-3.5 px-6 align-middle text-[13.5px] text-gray-600">{center.cameras}</td>
                <td className="py-3.5 px-6 align-middle text-right relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === center.id ? null : center.id)}
                    className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md hover:bg-neutral-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  {openMenuId === center.id && (
                    <div className="absolute right-12 top-8 w-28 bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-neutral-100 py-1 z-10 overflow-hidden">
                      <button
                        onClick={() => setSearchParams({ tab: 'Centre Setup' })}
                        className="w-full text-left px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-neutral-50 hover:text-gray-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button className="w-full text-left px-4 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors">
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const CentreSetupForm = () => {
    const [adminPcRows, setAdminPcRows] = useState([1]);
    const [lineRows, setLineRows] = useState([1]);
    const [cameraRows, setCameraRows] = useState([1]);

    return (
      <div className="flex flex-col gap-8 w-full max-w-5xl">
        {/* Top Form section */}
        <div className="flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[13px] font-medium text-gray-700">Center Name</label>
              <div className="relative">
                <select className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-[14px] focus:outline-none focus:border-neutral-400 bg-white appearance-none cursor-pointer">
                  <option>ABC</option>
                  <option>XYZ Center</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[13px] font-medium text-gray-700">Center Code</label>
              <input type="text" defaultValue="12345" className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-[14px] focus:outline-none focus:border-neutral-400" />
            </div>
          </div>

          <div className="flex gap-12 mt-2">
            <div className="flex items-center gap-3">
              <span className="text-[14.5px] font-medium text-gray-800">Manual Sync Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1a1a1a]"></div>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[14.5px] font-medium text-gray-800">Redo Test</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1a1a1a]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Cards section */}
        <div className="flex flex-col gap-5 mt-2">
          {/* Admin PC Set-up */}
          <div className="border border-neutral-200 rounded-xl p-6 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[16px] font-semibold text-gray-800">Admin PC Set-up</h3>
                <p className="text-[13px] text-gray-400 mt-0.5">System-wide settings and module configuration</p>
              </div>
              <button
                onClick={() => setAdminPcRows([...adminPcRows, adminPcRows.length + 1])}
                className="px-7 py-2 bg-[#1a1a1a] text-white rounded-lg text-[13.5px] font-medium hover:bg-black transition-colors shadow-sm"
              >
                Add
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {adminPcRows.map((rowId) => (
                <div key={rowId} className="flex gap-4 items-end">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[12.5px] font-medium text-gray-600">Select Admin PC</label>
                    <input type="text" defaultValue="ADMIN-PC-01" className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-[14px]" />
                  </div>
                  <div className="flex-[1.5] flex flex-col gap-2">
                    <label className="text-[12.5px] font-medium text-gray-600">IN-FILE Path</label>
                    <input type="text" defaultValue="//192.168.10.10/Admin1/Line1/Infolder" className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-[14px]" />
                  </div>
                  <div className="flex-[1.5] flex flex-col gap-2">
                    <label className="text-[12.5px] font-medium text-gray-600">OUT-FILE Path</label>
                    <input type="text" defaultValue="//192.168.10.10/Admin1/Line1/Infolder" className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-[14px]" />
                  </div>
                  <div className="flex pb-1.5">
                    <button
                      onClick={() => setAdminPcRows(adminPcRows.filter(id => id !== rowId))}
                      disabled={adminPcRows.length === 1}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Line Details */}
          <div className="border border-neutral-200 rounded-xl p-6 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[16px] font-semibold text-gray-800">Line Details</h3>
                <p className="text-[13px] text-gray-400 mt-0.5">System-wide settings and module configuration</p>
              </div>
              <button
                onClick={() => setLineRows([...lineRows, lineRows.length + 1])}
                className="px-7 py-2 bg-[#1a1a1a] text-white rounded-lg text-[13.5px] font-medium hover:bg-black transition-colors shadow-sm"
              >
                Add
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {lineRows.map((rowId) => (
                <div key={rowId} className="flex gap-4 items-end">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[12.5px] font-medium text-gray-600">Select Line </label>
                    <input type="text" defaultValue="ADMIN-PC-01" className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-[14px]" />
                  </div>
                  <div className="flex-[1.5] flex flex-col gap-2">
                    <label className="text-[12.5px] font-medium text-gray-600">IN-FILE Path</label>
                    <input type="text" defaultValue="//192.168.10.10/Admin1/Line1/Infolder" className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-[14px]" />
                  </div>
                  <div className="flex-[1.5] flex flex-col gap-2">
                    <label className="text-[12.5px] font-medium text-gray-600">OUT-FILE Path</label>
                    <input type="text" defaultValue="//192.168.10.10/Admin1/Line1/Infolder" className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-[14px]" />
                  </div>
                  <div className="flex pb-1.5">
                    <button
                      onClick={() => setLineRows(lineRows.filter(id => id !== rowId))}
                      disabled={lineRows.length === 1}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Camera Details */}
          <div className="border border-neutral-200 rounded-xl p-6 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[16px] font-semibold text-gray-800">Camera Details</h3>
                <p className="text-[13px] text-gray-400 mt-0.5">System-wide settings and module configuration</p>
              </div>
              <button
                onClick={() => setCameraRows([...cameraRows, cameraRows.length + 1])}
                className="px-7 py-2 bg-[#1a1a1a] text-white rounded-lg text-[13.5px] font-medium hover:bg-black transition-colors shadow-sm"
              >
                Add
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {cameraRows.map((rowId) => (
                <div key={rowId} className="flex gap-4 items-end">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[12.5px] font-medium text-gray-600">Select Camera</label>
                    <input type="text" defaultValue="ADMIN-PC-01" className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-[14px]" />
                  </div>
                  <div className="flex-[1.5] flex flex-col gap-2">
                    <label className="text-[12.5px] font-medium text-gray-600">IN-FILE Path</label>
                    <input type="text" defaultValue="//192.168.10.10/Admin1/Line1/Infolder" className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-[14px]" />
                  </div>
                  <div className="flex-[1.5] flex flex-col gap-2">
                    <label className="text-[12.5px] font-medium text-gray-600">OUT-FILE Path</label>
                    <input type="text" defaultValue="//192.168.10.10/Admin1/Line1/Infolder" className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-[14px]" />
                  </div>
                  <div className="flex pb-1.5">
                    <button
                      onClick={() => setCameraRows(cameraRows.filter(id => id !== rowId))}
                      disabled={cameraRows.length === 1}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LineTab = () => {
    const lines = [
      { id: 1, name: 'Line 1', details: 'Bay 1 • Heavy/Light', validDate: '23/06/26', active: true },
      { id: 2, name: 'Line 2', details: 'Bay 1 • Heavy/Light', validDate: '23/06/26', active: true },
      { id: 3, name: 'Line 3', details: 'Bay 1 • Heavy/Light', validDate: '23/06/26', active: true },
      { id: 4, name: 'Line 4', details: 'Bay 1 • Heavy/Light', validDate: '23/06/26', active: true },
    ];

    return (
      <div className="bg-[#fafafa] p-4 rounded-2xl w-full max-w-4xl border border-neutral-100">
        <div className="flex flex-col gap-4">
          {lines.map((line) => (
            <div key={line.id} className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-sm w-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[16px] font-semibold text-gray-900">{line.name}</h3>
                  <p className="text-[13px] text-gray-500 mt-0.5">{line.details}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={line.active} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1a1a1a]"></div>
                </label>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-medium text-gray-700">Valid Date</label>
                <input type="text" defaultValue={line.validDate} className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-[14px] focus:outline-none focus:border-neutral-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AnprTab = () => {
    const cameras = [
      { id: 1, endpoint: 'rtsp://192.168.1.50/anpr', threshold: '95', autoFill: true },
      { id: 2, endpoint: 'rtsp://192.168.1.51/anpr', threshold: '90', autoFill: true },
      { id: 3, endpoint: 'rtsp://192.168.1.52/anpr', threshold: '85', autoFill: false },
    ];

    return (
      <div className="grid grid-cols-2 gap-5 w-full">
        {cameras.map((cam) => (
          <div key={cam.id} className="border border-neutral-200 rounded-xl p-6 bg-white shadow-sm">
            <h3 className="text-[16px] font-semibold text-gray-800 mb-5">Cam {cam.id}</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[#64748b]">Camera Endpoint</label>
                <input type="text" defaultValue={cam.endpoint} className="w-full max-w-[400px] px-3 py-2 border border-[#e2e8f0] rounded-lg text-[14px] font-medium text-gray-900 focus:outline-none focus:border-neutral-400 bg-white" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[#64748b]">Confidence Threshold</label>
                <div className="relative w-full max-w-[400px]">
                  <select defaultValue={cam.threshold} className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-[14px] font-medium text-gray-900 focus:outline-none focus:border-neutral-400 bg-white appearance-none cursor-pointer">
                    <option value="95">95</option>
                    <option value="90">90</option>
                    <option value="85">85</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={cam.autoFill} />
                  <div className="w-[42px] h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[18px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1a1a1a]"></div>
                </label>
                <span className="text-[14.5px] font-medium text-gray-800">Auto-fill plate from ANPR</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const ChargesTab = () => {
    const [charges, setCharges] = useState([
      { id: 1, name: 'Sedan', no: '25', date: '23/06/26' },
      { id: 2, name: 'SUV', no: '30', date: '25/07/26' },
      { id: 3, name: 'Pickup', no: '28', date: '28/08/26' },
    ]);

    const handleAdd = () => {
      const newId = charges.length > 0 ? Math.max(...charges.map(c => c.id)) + 1 : 1;
      setCharges([...charges, { id: newId, name: '', no: '', date: '' }]);
    };

    const handleDelete = (id: number) => {
      setCharges(charges.filter(c => c.id !== id));
    };

    const updateCharge = (id: number, field: string, value: string) => {
      setCharges(charges.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const sum = charges.reduce((acc, curr) => acc + (parseFloat(curr.no) || 0), 0);

    return (
      <div className="bg-white p-8 rounded-2xl w-full max-w-4xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-neutral-100">
        <div className="flex justify-between items-end mb-4 px-1">
          <div className="grid grid-cols-[1fr_120px_150px_40px] gap-4 flex-1 items-center">
            <span className="text-[15px] font-bold text-gray-800">Charges Name</span>
            <span className="text-[14px] font-bold text-gray-800">Charges No</span>
            <span className="text-[14px] font-bold text-gray-800">Valid Date</span>
            <span></span>
          </div>
          <button 
            onClick={handleAdd}
            className="px-6 py-2 bg-[#1a1a1a] text-white rounded-lg text-[13px] font-medium hover:bg-black transition-colors"
          >
            Add
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {charges.map((charge) => (
            <div key={charge.id} className="grid grid-cols-[1fr_120px_150px_40px] gap-4 items-center">
              <div>
                <input 
                  type="text" 
                  value={charge.name}
                  onChange={(e) => updateCharge(charge.id, 'name', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-[14px] focus:outline-none focus:border-neutral-400 bg-white" 
                />
              </div>
              <div>
                <input 
                  type="number" 
                  value={charge.no}
                  onChange={(e) => updateCharge(charge.id, 'no', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-[14px] focus:outline-none focus:border-neutral-400 bg-white" 
                />
              </div>
              <div>
                <input 
                  type="text" 
                  value={charge.date}
                  onChange={(e) => updateCharge(charge.id, 'date', e.target.value)}
                  placeholder="DD/MM/YY"
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-[14px] focus:outline-none focus:border-neutral-400 bg-white" 
                />
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => handleDelete(charge.id)}
                  disabled={charges.length === 1}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
                  title="Delete row"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 px-1 text-[14px] font-medium text-gray-800">
          Total items: {charges.length} • Sum: OMR {sum.toFixed(2)}
        </div>
      </div>
    );
  };

  const ManualTestsTab = () => {
    const [tests, setTests] = useState([
      { id: 'brake', name: 'Brake', active: true },
      { id: 'light', name: 'Light', active: true },
      { id: 'suspension', name: 'Suspension', active: true },
      { id: 'emission', name: 'Emission', active: false },
    ]);

    const toggleTest = (id: string) => {
      setTests(tests.map(t => t.id === id ? { ...t, active: !t.active } : t));
    };

    return (
      <div className="bg-white p-7 rounded-2xl w-full max-w-lg shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 mb-1">
          <label className="text-[14px] font-medium text-gray-800">Valid Date</label>
          <input 
            type="text" 
            defaultValue="23/06/26" 
            className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-lg text-[14px] focus:outline-none focus:border-neutral-400 bg-white shadow-sm" 
          />
        </div>
        
        <div className="flex flex-col gap-3 mt-2">
          {tests.map(test => (
            <div key={test.id} className="bg-white px-4 py-3.5 rounded-xl flex justify-between items-center border border-neutral-100 shadow-sm">
              <span className="text-[15px] font-bold text-gray-900">{test.name}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={test.active}
                  onChange={() => toggleTest(test.id)} 
                />
                <div className="w-[42px] h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[18px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1a1a1a]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PlaceholderTab = () => (
    <div className="flex flex-col items-center justify-center py-20 bg-white border border-neutral-200 border-dashed rounded-xl">
      <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mb-3">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h3 className="text-[15px] font-semibold text-gray-800">Under Development</h3>
      <p className="text-[13px] text-gray-500 mt-1">The {activeTab} module is currently being built.</p>
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'Centre Setup') {
      return <CentreSetupForm />;
    }
    if (activeTab === 'Line') {
      return <LineTab />;
    }
    if (activeTab === 'ANPR') {
      return <AnprTab />;
    }
    if (activeTab === 'Charges') {
      return <ChargesTab />;
    }
    if (activeTab === 'Manual Tests') {
      return <ManualTestsTab />;
    }
    if (activeTab === 'Configuration') {
      return <CentersTable />;
    }
    return <PlaceholderTab />;
  };

  let pageTitle = activeTab;
  let pageSubtitle = "Manage global application configurations and system parameters.";

  if (activeTab === 'Centre Setup') {
    pageTitle = "Configuration";
    pageSubtitle = "System-wide settings and module configuration";
  } else if (activeTab === 'Line') {
    pageTitle = "Line";
    pageSubtitle = "System-wide settings and module configuration";
  } else if (activeTab === 'ANPR') {
    pageTitle = "Camera Setup";
    pageSubtitle = "System-wide settings and module configuration";
  } else if (activeTab === 'Charges') {
    pageTitle = "Charges";
    pageSubtitle = "Manage global application configurations and system parameters.";
  } else if (activeTab === 'Manual Tests') {
    pageTitle = "Configuration";
    pageSubtitle = "System-wide settings and module configuration";
  }

  return (
    <div className="w-full flex flex-col pt-3 pb-8 h-full">
      {/* Title Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b] leading-tight mb-1">{pageTitle}</h1>
          <p className="text-[14px] text-[#64748b] font-normal">{pageSubtitle}</p>
        </div>

      </div>

      <div className="flex-1 overflow-auto">

        {renderContent()}
      </div>
    </div>
  );
};

export default ConfigurationPage;
