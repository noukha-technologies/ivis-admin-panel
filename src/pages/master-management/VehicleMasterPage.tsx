import React, { useState, useEffect, useMemo } from 'react';
import { masterService } from '../../api/services/master.service';
import type { ApiVehicle } from '../../interfaces/vehicle.interface';
import { getApiErrorMessage } from '../../api/apiResponse';
import { toast } from 'sonner';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { RowActions } from '../../components/ui/RowActions';
import type { ColumnDef } from '../../interfaces/ui.interfaces';
import { PermissionGate } from '../../components/PermissionGate';
import { PERMISSIONS } from '../../constants/permissions';


const VehicleMasterPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<ApiVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal States
  const [selectedItem, setSelectedItem] = useState<ApiVehicle | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Lists for Form dropdowns
  const brandsList = ['Toyota', 'Nissan', 'Hyundai', 'Lexus', 'Kia', 'Honda', 'Mercedes-Benz', 'BMW', 'Tesla', 'Ford', 'Chevrolet'];
  const typesList = ['Sedan', 'SUV', 'Light Vehicle', 'Heavy Vehicle', 'Commercial', 'Pickup', 'Two-Wheeler'];
  const colorsList = ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Yellow', 'Gold'];

  const [formData, setFormData] = useState({
    vehicle_id: '',
    plate_number: '',
    vehicle_brand: '',
    vehicle_type: '',
    vehicle_color: '',
  });

  // Fetch vehicles on component mount / changes
  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const result = await masterService.vehicles.getAll({
        nonPaginated: true,
      });
      setVehicles(result.data);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to retrieve vehicle records.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const resetForm = () => {
    setFormData({
      vehicle_id: '',
      plate_number: '',
      vehicle_brand: '',
      vehicle_type: '',
      vehicle_color: '',
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowNewModal(true);
  };

  const handleOpenEdit = (item: ApiVehicle) => {
    setSelectedItem(item);
    setFormData({
      vehicle_id: String(item.vehicle_id),
      plate_number: item.plate_number,
      vehicle_brand: item.vehicle_brand,
      vehicle_type: item.vehicle_type,
      vehicle_color: item.vehicle_color,
    });
    setShowEditModal(true);
  };

  const handleOpenView = (item: ApiVehicle) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await masterService.vehicles.create({
        plate_number: formData.plate_number.trim(),
        vehicle_brand: formData.vehicle_brand,
        vehicle_type: formData.vehicle_type,
        vehicle_color: formData.vehicle_color,
      });
      setShowNewModal(false);
      resetForm();
      fetchVehicles();
      toast.success('Vehicle master record created successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to create vehicle record.'));
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
        plate_number: formData.plate_number.trim(),
        vehicle_brand: formData.vehicle_brand,
        vehicle_type: formData.vehicle_type,
        vehicle_color: formData.vehicle_color,
      });
      setShowEditModal(false);
      setSelectedItem(null);
      fetchVehicles();
      toast.success('Vehicle master record updated successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update vehicle record.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await masterService.vehicles.delete(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchVehicles();
      toast.success('Vehicle record deleted successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to delete vehicle record.'));
      setShowDeleteModal(false);
    }
  };

  const columns = useMemo<ColumnDef<ApiVehicle>[]>(() => [
    {
      id: 'vehicle_id',
      header: 'ID',
      accessorKey: 'vehicle_id',
      cell: ({ value }) => (
        <span className="font-semibold text-neutral-500">#{value}</span>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: 'plate_number',
      header: 'Plate Number',
      accessorKey: 'plate_number',
      cell: ({ value }) => (
        <span className="inline-flex items-center px-3 py-0.5 bg-[#f8fafc] border border-neutral-300 text-neutral-800 text-[13px] font-bold font-mono tracking-wider rounded">
          {value}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: 'vehicle_brand',
      header: 'Brand',
      accessorKey: 'vehicle_brand',
      cell: ({ value }) => <span className="font-semibold text-gray-900">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'vehicle_type',
      header: 'Type',
      accessorKey: 'vehicle_type',
      cell: ({ value }) => <span className="text-gray-600 font-semibold">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'vehicle_color',
      header: 'Color',
      accessorKey: 'vehicle_color',
      cell: ({ value }) => (
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full inline-block border border-neutral-300 shadow-sm"
            style={{
              backgroundColor: String(value).toLowerCase() === 'white' ? '#ffffff' :
                String(value).toLowerCase() === 'black' ? '#171717' :
                  String(value).toLowerCase() === 'silver' ? '#c0c0c0' :
                    String(value).toLowerCase() === 'gray' ? '#808080' :
                      String(value).toLowerCase() === 'red' ? '#ea4335' :
                        String(value).toLowerCase() === 'blue' ? '#4285f4' :
                          String(value).toLowerCase() === 'green' ? '#34a853' :
                            String(value).toLowerCase() === 'yellow' ? '#fbbc05' :
                              String(value).toLowerCase() === 'gold' ? '#ffd700' :
                                String(value).toLowerCase(),
            }}
          ></span>
          <span className="text-gray-600 font-medium">{value}</span>
        </div>
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
              id: 'view',
              label: 'View Details',
              icon: <Eye className="w-4 h-4 text-slate-500" />,
              onClick: () => handleOpenView(item),
            },
            {
              id: 'edit',
              label: 'Edit Record',
              icon: <Pencil className="w-4 h-4 text-slate-500" />,
              onClick: () => handleOpenEdit(item),
            },
            {
              id: 'delete',
              label: 'Delete',
              icon: <Trash2 className="w-4 h-4 text-rose-500" />,
              onClick: () => openDeleteModal(item.id),
              variant: 'danger' as const,
            },
          ]}
        />
      ),
    },
  ], []);

  return (
    <div className="w-full flex flex-col relative">
      <DataTable
        data={vehicles}
        columns={columns}
        loading={isLoading}
        searchPlaceholder="Search plate, type, brand or color"
        defaultPageSize={8}
        leftElement={
          <PermissionGate permission={PERMISSIONS.MASTERS_CREATE}>
            <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#171717] hover:bg-neutral-800 text-white font-semibold text-[13.5px] rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
            </svg>
            <span>Add Vehicle</span>
          </button>
          </PermissionGate>
        }
      />

      {/* VIEW DETAILS MODAL */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-[#0b0f19]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-125 border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4.5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-neutral-800">Vehicle Master Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-neutral-100 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4 text-[14px]">
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Record ID</span>
                <span className="col-span-2 text-neutral-800 font-mono font-bold">{selectedItem.id}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Vehicle ID</span>
                <span className="col-span-2 text-neutral-800 font-mono font-bold">#{selectedItem.vehicle_id}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Plate Number</span>
                <span className="col-span-2">
                  <span className="inline-flex items-center px-3 py-0.5 bg-neutral-50 border-2 border-neutral-800 text-neutral-800 text-[13px] font-bold font-mono tracking-wider rounded">
                    {selectedItem.plate_number}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Brand</span>
                <span className="col-span-2 text-neutral-800 font-bold">{selectedItem.vehicle_brand}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Type</span>
                <span className="col-span-2 text-neutral-800 font-semibold">{selectedItem.vehicle_type}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Color</span>
                <span className="col-span-2 text-neutral-800 flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block border border-neutral-200"
                    style={{ backgroundColor: selectedItem.vehicle_color.toLowerCase() }}
                  ></span>
                  <span>{selectedItem.vehicle_color}</span>
                </span>
              </div>
              {selectedItem.created_by && (
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                  <span className="text-gray-400 font-medium">Created By</span>
                  <span className="col-span-2 text-neutral-800 font-mono">{selectedItem.created_by}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Created Date</span>
                <span className="col-span-2 text-neutral-700">
                  {new Date(selectedItem.created_at).toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5">
                <span className="text-gray-400 font-medium">Last Updated</span>
                <span className="col-span-2 text-neutral-700">
                  {new Date(selectedItem.updated_at).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-[13px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 bg-[#0b0f19]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-120 border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
              <h3 className="text-[18px] font-bold text-[#101828]">Add Vehicle</h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Plate Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9845-KA"
                    value={formData.plate_number}
                    onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm font-mono uppercase"
                  />
                </div>

                <div className="grid grid-cols-10 gap-3">
                  <div className="col-span-4">
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Brand</label>
                    <select
                      required
                      value={formData.vehicle_brand}
                      onChange={(e) => setFormData({ ...formData, vehicle_brand: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 10px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '18px',
                      }}
                    >
                      <option value="" disabled>Select</option>
                      {brandsList.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Type</label>
                    <select
                      required
                      value={formData.vehicle_type}
                      onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 10px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '18px',
                      }}
                    >
                      <option value="" disabled>Select</option>
                      {typesList.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Color</label>
                    <select
                      required
                      value={formData.vehicle_color}
                      onChange={(e) => setFormData({ ...formData, vehicle_color: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 10px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '18px',
                      }}
                    >
                      <option value="" disabled>Select</option>
                      {colorsList.map((color) => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="px-5 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    {isSubmitting && (
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-[#0b0f19]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-120 border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
              <h3 className="text-[18px] font-bold text-[#101828]">Edit Vehicle</h3>
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditSave}>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Plate Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9845-KA"
                    value={formData.plate_number}
                    onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm font-mono uppercase"
                  />
                </div>

                <div className="grid grid-cols-10 gap-3">
                  <div className="col-span-4">
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Brand</label>
                    <select
                      required
                      value={formData.vehicle_brand}
                      onChange={(e) => setFormData({ ...formData, vehicle_brand: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 10px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '18px',
                      }}
                    >
                      <option value="" disabled>Select</option>
                      {brandsList.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Type</label>
                    <select
                      required
                      value={formData.vehicle_type}
                      onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 10px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '18px',
                      }}
                    >
                      <option value="" disabled>Select</option>
                      {typesList.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Color</label>
                    <select
                      required
                      value={formData.vehicle_color}
                      onChange={(e) => setFormData({ ...formData, vehicle_color: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm cursor-pointer appearance-none pr-8"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23667085' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 10px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '18px',
                      }}
                    >
                      <option value="" disabled>Select</option>
                      {colorsList.map((color) => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedItem(null);
                    }}
                    className="px-5 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    {isSubmitting && (
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-[#0b0f19]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-100 border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-[17px] font-bold text-neutral-800 mb-1">Delete Vehicle Master</h3>
              <p className="text-[13px] text-gray-500 max-w-70 mx-auto">Are you sure you want to delete this record? This action cannot be undone.</p>
            </div>
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                className="flex-1 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[13.5px] font-semibold rounded-xl cursor-pointer transition-all"
              >
                No, Keep it
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[13.5px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleMasterPage;
