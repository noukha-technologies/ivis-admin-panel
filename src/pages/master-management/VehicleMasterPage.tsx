import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Trash2, UserX } from 'lucide-react';
import { masterService } from '../../api/services/master.service';
import type { ApiVehicle, VehicleMasterStatus } from '../../interfaces/vehicle.interface';
import { getApiErrorMessage } from '../../api/apiResponse';
import { DataTable } from '../../components/ui/DataTable';
import { RowActions } from '../../components/ui/RowActions';
import type { ColumnDef } from '../../interfaces/ui.interfaces';
import { PermissionGate } from '../../components/PermissionGate';
import { PERMISSIONS } from '../../constants/permissions';
import { SideDrawer } from '../../components/ui/SideDrawer';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { VehicleStatusBadge } from '../../components/masters/VehicleStatusBadge';

type DrawerMode = 'create' | 'edit' | 'view' | null;

interface VehicleFormState {
  name: string;
  code: string;
  vin_no: string;
  status: VehicleMasterStatus;
}

const emptyForm = (): VehicleFormState => ({
  name: '',
  code: '',
  vin_no: '',
  status: 'Active',
});

function formatCreatedDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function vehicleToForm(item: ApiVehicle): VehicleFormState {
  return {
    name: item.name,
    code: item.code,
    vin_no: item.vin_no ?? '',
    status: item.status,
  };
}

const VehicleMasterPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<ApiVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [selectedItem, setSelectedItem] = useState<ApiVehicle | null>(null);
  const [formData, setFormData] = useState<VehicleFormState>(emptyForm);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiVehicle | null>(null);

  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [inactiveTarget, setInactiveTarget] = useState<ApiVehicle | null>(null);

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await masterService.vehicles.getAll({ nonPaginated: true });
      setVehicles(result.data);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to retrieve vehicle masters.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchVehicles();
  }, [fetchVehicles]);

  const closeDrawer = () => {
    setDrawerMode(null);
    setSelectedItem(null);
    setFormData(emptyForm());
  };

  const openCreate = () => {
    setSelectedItem(null);
    setFormData(emptyForm());
    setDrawerMode('create');
  };

  const openEdit = (item: ApiVehicle) => {
    setSelectedItem(item);
    setFormData(vehicleToForm(item));
    setDrawerMode('edit');
  };

  const openView = (item: ApiVehicle) => {
    setSelectedItem(item);
    setFormData(vehicleToForm(item));
    setDrawerMode('view');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await masterService.vehicles.create({
        name: formData.name.trim(),
        code: formData.code.trim(),
        vin_no: formData.vin_no.trim() || undefined,
        status: formData.status,
      });
      closeDrawer();
      await fetchVehicles();
      toast.success('Vehicle master created successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to create vehicle master.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      await masterService.vehicles.update(selectedItem.id, {
        name: formData.name.trim(),
        code: formData.code.trim(),
        vin_no: formData.vin_no.trim() || undefined,
        status: formData.status,
      });
      closeDrawer();
      await fetchVehicles();
      toast.success('Vehicle master updated successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update vehicle master.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (item: ApiVehicle) => {
    setDeleteTarget(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await masterService.vehicles.delete(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      await fetchVehicles();
      toast.success('Vehicle master deleted successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to delete vehicle master.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openInactiveModal = (item: ApiVehicle) => {
    if (item.status !== 'Active') {
      toast.info('Only active vehicles can be suspended from this action.');
      return;
    }
    setInactiveTarget(item);
    setShowInactiveModal(true);
  };

  const confirmInactive = async () => {
    if (!inactiveTarget) return;
    setIsSubmitting(true);
    try {
      await masterService.vehicles.update(inactiveTarget.id, { status: 'Suspended' });
      setShowInactiveModal(false);
      setInactiveTarget(null);
      await fetchVehicles();
      toast.success('Vehicle suspended successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update vehicle status.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const drawerTitle =
    drawerMode === 'create'
      ? 'Add Vehicle'
      : drawerMode === 'edit'
        ? 'Edit Vehicle'
        : 'Vehicle Details';

  const isReadOnly = drawerMode === 'view';
  const drawerOpen = drawerMode !== null;

  const drawerFooter =
    drawerMode === 'view' ? (
      <div className="flex items-center justify-end w-full">
        <button
          type="button"
          onClick={closeDrawer}
          className="px-6 py-2 bg-[#1f2937] hover:bg-[#111827] text-white font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer"
        >
          Close
        </button>
      </div>
    ) : (
      <div className="flex items-center justify-end gap-3 w-full">
        <button
          type="button"
          onClick={closeDrawer}
          className="px-6 py-2 border border-red-500 text-red-500 hover:bg-red-50 font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="vehicle-master-form"
          disabled={isSubmitting}
          className="px-6 py-2 bg-[#1f2937] hover:bg-[#111827] text-white font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    );

  const columns = useMemo<ColumnDef<ApiVehicle>[]>(
    () => [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        cell: ({ value }) => (
          <span className="font-semibold text-gray-900">{String(value)}</span>
        ),
        enableSorting: true,
      },
      {
        id: 'vin_no',
        header: 'VIN No',
        accessorKey: 'vin_no',
        cell: ({ value }) => (
          <span className="font-mono text-[13px] text-neutral-700">
            {value ? String(value) : '—'}
          </span>
        ),
        enableSorting: true,
      },
      {
        id: 'code',
        header: 'Code',
        accessorKey: 'code',
        cell: ({ value }) => <span className="text-gray-700 font-medium">{String(value)}</span>,
        enableSorting: true,
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ value }) => <VehicleStatusBadge status={value as VehicleMasterStatus} />,
        enableSorting: true,
      },
      {
        id: 'created_at',
        header: 'Created',
        accessorKey: 'created_at',
        cell: ({ value }) => (
          <span className="text-gray-600 text-[13.5px]">{formatCreatedDate(String(value))}</span>
        ),
        enableSorting: true,
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        enableHiding: false,
        cell: ({ row: item }) => (
          <RowActions
            actions={[
              {
                id: 'edit',
                label: 'Edit',
                icon: <Pencil className="w-4 h-4 text-slate-500" />,
                onClick: () => openEdit(item),
              },
              {
                id: 'inactive',
                label: 'Inactive',
                icon: <UserX className="w-4 h-4 text-slate-500" />,
                onClick: () => openInactiveModal(item),
              },
              {
                id: 'delete',
                label: 'Delete',
                icon: <Trash2 className="w-4 h-4 text-rose-500" />,
                onClick: () => openDeleteModal(item),
                variant: 'danger' as const,
              },
            ]}
          />
        ),
      },
    ],
    [],
  );

  const renderFormFields = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
        <input
          type="text"
          required
          readOnly={isReadOnly}
          placeholder="e.g. Toyota"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm disabled:bg-neutral-50"
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
        <input
          type="text"
          required
          readOnly={isReadOnly}
          placeholder="e.g. VT-SED-LIGHT"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm disabled:bg-neutral-50"
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">VIN No</label>
        <input
          type="text"
          readOnly={isReadOnly}
          placeholder="e.g. JN1AZ32E90U123456"
          value={formData.vin_no}
          onChange={(e) => setFormData({ ...formData, vin_no: e.target.value })}
          className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] font-mono text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm disabled:bg-neutral-50"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[13px] font-semibold text-[#344054]">Active</span>
        <button
          type="button"
          disabled={isReadOnly}
          onClick={() =>
            setFormData({
              ...formData,
              status: formData.status === 'Active' ? 'Inactive' : 'Active',
            })
          }
          className="disabled:cursor-not-allowed"
          aria-label="Toggle active status"
        >
          <div
            className={`relative w-13 h-7 rounded-full transition-colors duration-200 ease-in-out border ${
              formData.status === 'Active'
                ? 'bg-[#171717] border-[#171717]'
                : 'bg-neutral-200 border-neutral-300'
            }`}
          >
            <div
              className={`absolute top-0.75 left-0.75 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                formData.status === 'Active' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </div>
        </button>
      </div>

      {drawerMode === 'view' && selectedItem && (
        <div className="pt-2 space-y-3 border-t border-neutral-100 text-[14px]">
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Record status</span>
            <VehicleStatusBadge status={selectedItem.status} />
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Vehicle ID</span>
            <span className="font-mono font-semibold text-neutral-800">#{selectedItem.vehicle_id}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Created</span>
            <span className="text-neutral-700">{formatCreatedDate(selectedItem.created_at)}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex flex-col relative">
      <DataTable
        data={vehicles}
        columns={columns}
        loading={isLoading}
        searchPlaceholder="Search by"
        animatedSearchHints={['Name', 'Code', 'VIN No', 'Status']}
        defaultPageSize={10}
        onRowClick={openView}
        rightElement={
          <PermissionGate permission={PERMISSIONS.MASTERS_CREATE}>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#101828] hover:bg-neutral-800 text-white font-semibold text-[13.5px] rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-60 whitespace-nowrap shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
              </svg>
              <span>New Vehicle</span>
            </button>
          </PermissionGate>
        }
      />

      <SideDrawer
        open={drawerOpen}
        onOpenChange={(open) => {
          if (!open) closeDrawer();
        }}
        title={drawerTitle}
        size="sm"
        showCloseButton={false}
        bodyClassName="pt-6"
        footer={drawerFooter}
      >
        {drawerMode === 'view' ? (
          renderFormFields()
        ) : (
          <form
            id="vehicle-master-form"
            onSubmit={drawerMode === 'create' ? handleCreate : handleEditSave}
          >
            {renderFormFields()}
          </form>
        )}
      </SideDrawer>

      <ConfirmationModal
        variant="danger"
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Vehicle"
        message="Are you sure you want to delete this Vehicle? This action cannot be undone."
        isSubmitting={isSubmitting}
      />

      <ConfirmationModal
        variant="warning"
        isOpen={showInactiveModal}
        onClose={() => {
          setShowInactiveModal(false);
          setInactiveTarget(null);
        }}
        onConfirm={confirmInactive}
        title="Inactive Vehicle"
        message="Do you want Inactive this Vehicle?"
        confirmText="Yes, Suspend"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default VehicleMasterPage;
