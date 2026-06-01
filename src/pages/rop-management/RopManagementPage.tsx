import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useRopVerifications } from '../../features/rop/hooks/useRopVerifications';
import { DataTable } from '../../components/ui/DataTable';
import type { ColumnDef } from '../../interfaces/ui.interfaces';

const RopManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Vehicle Fetch' | 'Job Submission'>('Vehicle Fetch');
  const rop = useRopVerifications();

  useEffect(() => {
    rop.setPage(1);
  }, [activeTab]);

  useEffect(() => {
    if (rop.error) {
      toast.error(rop.error);
    }
  }, [rop.error]);

  const rawData = useMemo(() => {
    return activeTab === 'Vehicle Fetch'
      ? rop.items.map((item) => ({
          id: `ROP-${item.raw.rop_verification_id}`,
          time: item.raw.created_at.slice(0, 16).replace('T', ' '),
          message: `${item.fetchStatus} — ${item.regNo} (${item.owner})`,
          status: item.fetchStatus === 'Fetched' ? 'Success' : 'Failed',
        }))
      : [];
  }, [activeTab, rop.items]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      cell: ({ value }) => <span className="font-semibold text-gray-900">{value}</span>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: 'time',
      header: 'Time',
      accessorKey: 'time',
      cell: ({ value }) => <span className="text-gray-500 font-medium">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'message',
      header: 'Message',
      accessorKey: 'message',
      cell: ({ value }) => <span className="text-gray-500 font-medium">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ value }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium border select-none ${
          value === 'Success'
            ? 'bg-[#ecfdf5] text-[#027a48] border-[#abf0cd]'
            : 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]/60'
        }`}>
          {value}
        </span>
      ),
      enableSorting: true,
    },
  ], []);

  return (
    <div className="flex flex-col gap-4 min-h-full" style={{ marginLeft: '20px', marginRight: '20px', marginTop: '6px' }}>

      <DataTable
        loading={activeTab === 'Vehicle Fetch' ? rop.isLoading : false}
        data={rawData}
        columns={columns}
        searchPlaceholder="Search"
        leftElement={
          <div className="flex flex-row bg-white rounded-lg border border-gray-200 overflow-hidden shrink-0" style={{ height: '38px', flexShrink: 0 }}>
            {(['Vehicle Fetch', 'Job Submission'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm cursor-pointer transition-all duration-200 ${
                  activeTab === tab ? 'font-semibold bg-gray-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
                }`}
                style={{ whiteSpace: 'nowrap' }}
              >
                {tab}
              </button>
            ))}
          </div>
        }
      />
    </div>
  );
};

export default RopManagementPage;
