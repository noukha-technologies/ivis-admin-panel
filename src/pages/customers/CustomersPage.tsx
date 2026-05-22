import React, { useState, useEffect } from 'react';

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  idNumber: string;
  plate: string;
  chassis: string;
  vehicle: string;
}

const CustomersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const [customers, setCustomers] = useState<CustomerRecord[]>([
    {
      id: '1',
      name: 'Ahmed Al-Said',
      phone: '+968 91000000',
      idNumber: 'ID20000000',
      plate: 'OM-1000',
      chassis: 'JT2BF22K0W0123456',
      vehicle: 'Sedan'
    },
    {
      id: '2',
      name: 'Salim Al-Harthy',
      phone: '+968 92000123',
      idNumber: 'ID20000123',
      plate: 'OM-4930',
      chassis: 'JT2BF22K0W0123457',
      vehicle: 'SUV'
    },
    {
      id: '3',
      name: 'Fatima Al-Balushi',
      phone: '+968 93000456',
      idNumber: 'ID20000456',
      plate: 'OM-8812',
      chassis: 'JT2BF22K0W0123458',
      vehicle: 'Sedan'
    },
    {
      id: '4',
      name: 'Said Al-Habsi',
      phone: '+968 94000789',
      idNumber: 'ID20000789',
      plate: 'OM-3044',
      chassis: 'JT2BF22K0W0123459',
      vehicle: 'Hatchback'
    },
    {
      id: '5',
      name: 'Amna Al-Jahwari',
      phone: '+968 95000987',
      idNumber: 'ID20000987',
      plate: 'OM-9081',
      chassis: 'JT2BF22K0W0123460',
      vehicle: 'SUV'
    },
    {
      id: '6',
      name: 'Yahya Al-Kharusi',
      phone: '+968 96000654',
      idNumber: 'ID20000654',
      plate: 'OM-6677',
      chassis: 'JT2BF22K0W0123461',
      vehicle: 'Sedan'
    },
    {
      id: '7',
      name: 'Mona Al-Farsi',
      phone: '+968 97000321',
      idNumber: 'ID20000321',
      plate: 'OM-5522',
      chassis: 'JT2BF22K0W0123462',
      vehicle: 'Sedan'
    },
    {
      id: '8',
      name: 'Hamed Al-Rawahi',
      phone: '+968 98000111',
      idNumber: 'ID20000111',
      plate: 'OM-4110',
      chassis: 'JT2BF22K0W0123463',
      vehicle: 'SUV'
    },
    {
      id: '9',
      name: 'Mazin Al-Sadi',
      phone: '+968 99000222',
      idNumber: 'ID20000222',
      plate: 'OM-1928',
      chassis: 'JT2BF22K0W0123464',
      vehicle: 'Sedan'
    },
    {
      id: '10',
      name: 'Khalid Al-Riyami',
      phone: '+968 91100333',
      idNumber: 'ID20000333',
      plate: 'OM-7721',
      chassis: 'JT2BF22K0W0123465',
      vehicle: 'Hatchback'
    },
    {
      id: '11',
      name: 'John Doe',
      phone: '+968 92200444',
      idNumber: 'ID20000444',
      plate: 'OM-2033',
      chassis: 'JT2BF22K0W0123466',
      vehicle: 'Coupe'
    },
    {
      id: '12',
      name: 'Ali Al-Wahaibi',
      phone: '+968 93300555',
      idNumber: 'ID20000555',
      plate: 'OM-1024',
      chassis: 'JT2BF22K0W0123467',
      vehicle: 'SUV'
    }
  ]);

  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdownId(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.idNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.chassis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCustomers = filteredCustomers.slice(
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
        <div></div>
      </div>

      {/* Main Container */}
      <div className="w-full overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>
                  <div className="flex items-center gap-1">
                    Customer
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Phone</th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>ID Number</th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Plate</th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Chassis</th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap" style={{ padding: '12px 20px' }}>Vehicle</th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold whitespace-nowrap w-12" style={{ padding: '12px 20px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-100 transition-colors duration-150 cursor-pointer hover:bg-gray-50 bg-white"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{customer.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{customer.idNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{customer.plate}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{customer.chassis}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{customer.vehicle}</td>
                    <td className="px-6 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block text-left">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(activeDropdownId === customer.id ? null : customer.id);
                          }}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>

                        {activeDropdownId === customer.id && (
                          <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 font-semibold text-[13px] text-gray-700 text-left">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Viewing customer: ${customer.name}`);
                                setActiveDropdownId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5 transition-colors text-slate-700"
                            >
                              View
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Editing customer: ${customer.name}`);
                                setActiveDropdownId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5 transition-colors text-slate-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Are you sure you want to delete customer ${customer.name}?`)) {
                                  setCustomers(customers.filter(c => c.id !== customer.id));
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
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-white">
            <span className="text-[13px] text-slate-500 font-medium">
              Page {currentPage} of {Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE))} · {filteredCustomers.length} Records
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
                onClick={() => setCurrentPage((p) => Math.min(Math.ceil(filteredCustomers.length / PAGE_SIZE), p + 1))}
                disabled={currentPage >= Math.ceil(filteredCustomers.length / PAGE_SIZE)}
                className={`px-4 py-1.5 text-[13px] font-medium border border-slate-300 rounded-lg bg-white transition-all duration-150 ${currentPage >= Math.ceil(filteredCustomers.length / PAGE_SIZE) ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CustomersPage;
