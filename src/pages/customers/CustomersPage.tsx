import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import type { ColumnDef } from '../../interfaces/ui.interfaces';

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  idNumber: string;
  plate: string;
  chassis: string;
  vehicle: string;
  avatarUrl?: string; // Optional mockup avatar image
}

const CustomersPage: React.FC = () => {
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
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Preset list of gorgeous background colors for customer initial avatars
  const avatarColors: { [key: string]: string } = {
    'A': 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]',
    'S': 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]',
    'F': 'bg-[#fdf2f8] text-[#be185d] border-[#fbcfe8]',
    'M': 'bg-[#fff7ed] text-[#c2410c] border-[#ffedd5]',
    'Y': 'bg-[#faf5ff] text-[#6b21a8] border-[#e9d5ff]',
    'H': 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]',
    'K': 'bg-[#fff1f2] text-[#be123c] border-[#fecdd3]',
    'J': 'bg-[#f5f5f4] text-[#44403c] border-[#e7e5e4]',
  };

  const getAvatarColor = (name: string): string => {
    const char = name.charAt(0).toUpperCase();
    return avatarColors[char] || 'bg-neutral-100 text-neutral-600 border-neutral-200';
  };

  // Define Columns Definition for reusable DataTable
  const columns: ColumnDef<CustomerRecord>[] = [
    {
      id: 'customer',
      header: 'Customer',
      accessorKey: 'name',
      cell: ({ row }) => {
        const initials = row.name.charAt(0).toUpperCase();
        const colorClasses = getAvatarColor(row.name);
        return (
          <div className="flex items-center gap-3">
            {row.avatarUrl ? (
              <img
                src={row.avatarUrl}
                alt={row.name}
                className="w-8 h-8 rounded-full border border-neutral-200 object-cover"
              />
            ) : (
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-[12.5px] shadow-sm shrink-0 select-none ${colorClasses}`}>
                {initials}
              </div>
            )}
            <span className="font-bold text-[#101828]">{row.name}</span>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false, // Core field, cannot be hidden
    },
    {
      id: 'phone',
      header: 'Phone',
      accessorKey: 'phone',
      cell: ({ value }) => <span className="text-[#475467] font-medium">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'idNumber',
      header: 'ID Number',
      accessorKey: 'idNumber',
      cell: ({ value }) => <span className="text-[#475467] font-normal">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'plate',
      header: 'Plate',
      accessorKey: 'plate',
      cell: ({ value }) => <span className="text-[#101828] font-bold">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'chassis',
      header: 'Chassis',
      accessorKey: 'chassis',
      cell: ({ value }) => <span className="text-[#475467] font-mono text-[13px] tracking-tight">{value}</span>,
      enableSorting: false,
    },
    {
      id: 'vehicle',
      header: 'Vehicle',
      accessorKey: 'vehicle',
      cell: ({ value }) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-bold bg-neutral-50 border border-neutral-100 text-neutral-700">
          {value}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const isDropdownActive = activeDropdownId === row.id;
        return (
          <div className="relative text-right" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveDropdownId(isDropdownActive ? null : row.id)}
              className="w-8 h-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-[#98a2b3] hover:text-[#475467] transition-all cursor-pointer ml-auto"
            >
              <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="currentColor"/>
                <circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="currentColor"/>
                <circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="currentColor"/>
              </svg>
            </button>

            {isDropdownActive && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-9 w-32 bg-white border border-neutral-200 rounded-xl shadow-lg py-1.5 z-50 animate-fadeInMenu text-left"
              >
                <button
                  onClick={() => {
                    alert(`Viewing customer: ${row.name}`);
                    setActiveDropdownId(null);
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    alert(`Editing customer: ${row.name}`);
                    setActiveDropdownId(null);
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                >
                  Edit details
                </button>
                <div className="h-px bg-neutral-100 my-1"></div>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete customer ${row.name}?`)) {
                      setCustomers(customers.filter(c => c.id !== row.id));
                    }
                    setActiveDropdownId(null);
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="flex flex-col gap-4 min-h-full px-5 pt-3">
      {/* Title Header */}
      <div className="mb-2">
        <h1 className="text-[26px] font-bold text-[#101828] leading-tight mb-1">Customers</h1>
        <p className="text-[14px] text-[#475467] font-normal">Manage customer accounts, assigned plates and vehicles records</p>
      </div>

      {/* Global generic Reusable DataTable */}
      <DataTable
        data={customers}
        columns={columns}
        searchPlaceholder="Search customers..."
        filterColumnKey="vehicle"
        filterPlaceholder="All Vehicles"
        filterOptions={[
          { label: 'Sedan', value: 'Sedan' },
          { label: 'SUV', value: 'SUV' },
          { label: 'Hatchback', value: 'Hatchback' },
          { label: 'Coupe', value: 'Coupe' },
        ]}
      />
    </div>
  );
};

export default CustomersPage;
