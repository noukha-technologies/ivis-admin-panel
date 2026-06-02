import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { DataTable } from '../../components/ui/DataTable';
import type { ColumnDef } from '../../interfaces/ui.interfaces';
import { useCustomers } from '../../features/customers/hooks/useCustomers';
import type { CustomerListItem } from '../../features/customers/types';

const CustomersPage: React.FC = () => {
  const { items: customers, removeCustomer, error, isLoading } = useCustomers();

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
  const columns: ColumnDef<CustomerListItem>[] = [
    {
      id: 'customer',
      header: 'Customer',
      accessorKey: 'name',
      cell: ({ row }) => {
        const initials = row.name.charAt(0).toUpperCase();
        const colorClasses = getAvatarColor(row.name);
        return (
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-[12.5px] shadow-sm shrink-0 select-none ${colorClasses}`}>
              {initials}
            </div>
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
                <div className="h-px bg-neutral-100 my-1"></div>
                <button
                  onClick={async () => {
                    if (confirm(`Are you sure you want to delete customer ${row.name}?`)) {
                      const ok = await removeCustomer(row.id);
                      if (ok) toast.success('Customer deleted');
                      else toast.error('Failed to delete customer');
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

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="flex flex-col gap-2 min-h-full px-5 pt-0">

      <DataTable
        loading={isLoading}
        data={customers}
        columns={columns}
        searchPlaceholder="Search customers..."
        filterColumnKey="vehicle"
        filterPlaceholder="All Vehicles"
        filterPosition="left"
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
