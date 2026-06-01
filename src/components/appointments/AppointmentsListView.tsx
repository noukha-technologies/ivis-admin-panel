import React, { useMemo } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import type { AppointmentListRow } from '@/features/appointments/types';
import type { ColumnDef } from '@/interfaces/ui.interfaces';

interface AppointmentsListViewProps {
  rows: AppointmentListRow[];
  searchQuery: string;
  isLoading?: boolean;
}

export const AppointmentsListView: React.FC<AppointmentsListViewProps> = ({
  rows,
  searchQuery,
  isLoading = false,
}) => {
  const columns = useMemo<ColumnDef<AppointmentListRow>[]>(() => [
    {
      header: 'Queue Sq',
      accessorKey: 'seq',
      cell: ({ value }) => (
        <span className="font-semibold text-gray-900 underline">{value}</span>
      ),
      enableHiding: false,
      enableSorting: true,
    },
    {
      header: 'Customer',
      accessorKey: 'customer',
      cell: ({ value }) => <span className="text-gray-500">{value}</span>,
      enableSorting: false,
    },
    {
      header: 'Vehicle',
      accessorKey: 'vehicle',
      cell: ({ value }) => <span className="font-semibold text-gray-900">{value}</span>,
      enableSorting: true,
    },
    {
      header: 'Center',
      accessorKey: 'center',
      cell: ({ value }) => <span className="text-gray-500">{value}</span>,
      enableSorting: false,
    },
    {
      header: 'Line',
      accessorKey: 'line',
      cell: ({ value }) => <span className="text-gray-500">{value}</span>,
      enableSorting: false,
    },
    {
      header: 'Created',
      accessorKey: 'created',
      cell: ({ value }) => <span className="text-gray-500">{value}</span>,
      enableSorting: true,
    },
  ], []);

  // Filter vehicles based on search query
  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter(
      (item) =>
        item.seq.toLowerCase().includes(query) ||
        item.customer.toLowerCase().includes(query) ||
        item.vehicle.toLowerCase().includes(query) ||
        item.center.toLowerCase().includes(query) ||
        item.line.toLowerCase().includes(query) ||
        item.created.toLowerCase().includes(query),
    );
  }, [rows, searchQuery]);


  return (
    <div className="w-full flex flex-col">
      <DataTable
        data={filteredRows}
        columns={columns}
        loading={isLoading}
        showControls={false}
        showPagination={true}
        defaultPageSize={10}
      />
    </div>
  );
};
