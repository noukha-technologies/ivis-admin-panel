import React, { useMemo } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import type { ColumnDef } from '../../../interfaces/ui.interfaces';

export interface VehicleListItem {
  seq: string;
  customer: string;
  vehicle: string;
  center: string;
  line: string;
  created: string;
}

interface AppointmentsListViewProps {
  vehicles: VehicleListItem[];
  searchQuery: string;
}

export const AppointmentsListView: React.FC<AppointmentsListViewProps> = ({
  vehicles,
  searchQuery,
}) => {
  // Define columns matching the user's mockup design and exact table cell UI
  const columns = useMemo<ColumnDef<VehicleListItem>[]>(() => [
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
  const filteredVehicles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return vehicles;

    return vehicles.filter(
      (item) =>
        item.seq.toLowerCase().includes(query) ||
        item.customer.toLowerCase().includes(query) ||
        item.vehicle.toLowerCase().includes(query) ||
        item.center.toLowerCase().includes(query) ||
        item.line.toLowerCase().includes(query) ||
        item.created.toLowerCase().includes(query)
    );
  }, [vehicles, searchQuery]);

  return (
    <div className="w-full flex flex-col">
      {/* Table rendered using the generic reusable DataTable with its built-in pagination */}
      <DataTable
        data={filteredVehicles}
        columns={columns}
        showControls={false}
        showPagination={true}
        defaultPageSize={10}
      />
    </div>
  );
};
