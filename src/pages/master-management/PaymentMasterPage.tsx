import React, { useState, useEffect, useMemo } from 'react';
import { masterService } from '../../api/services/master.service';
import type { ApiPayment } from '../../interfaces/payment.interface';
import { getApiErrorMessage } from '../../api/apiResponse';
import { toast } from 'sonner';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { RowActions } from '../../components/ui/RowActions';
import type { ColumnDef } from '../../interfaces/ui.interfaces';

const PaymentMasterPage: React.FC = () => {
  const [payments, setPayments] = useState<ApiPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal States
  const [selectedItem, setSelectedItem] = useState<ApiPayment | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  // Fetch payments
  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const result = await masterService.payments.getAll({
        limit: 1000, // Load all at once for seamless local searching & paging
      });
      setPayments(result.data);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to retrieve payment records.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      status: 'Active',
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowNewModal(true);
  };

  const handleOpenEdit = (item: ApiPayment) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      code: item.code,
      status: item.status,
    });
    setShowEditModal(true);
  };

  const handleOpenView = (item: ApiPayment) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await masterService.payments.create({
        name: formData.name.trim(),
        code: formData.code.trim(),
        status: formData.status,
      });
      setShowNewModal(false);
      resetForm();
      fetchPayments();
      toast.success('Payment master record created successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to create payment record.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsSubmitting(true);

    try {
      await masterService.payments.update(selectedItem.id, {
        name: formData.name.trim(),
        code: formData.code.trim(),
        status: formData.status,
      });
      setShowEditModal(false);
      setSelectedItem(null);
      fetchPayments();
      toast.success('Payment master record updated successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update payment record.'));
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
      await masterService.payments.delete(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchPayments();
      toast.success('Payment record deleted successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to delete payment record.'));
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch {
      return dateStr;
    }
  };

  const columns = useMemo<ColumnDef<ApiPayment>[]>(() => [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      cell: ({ value }) => <span className="font-semibold text-gray-900">{value}</span>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: 'code',
      header: 'Code',
      accessorKey: 'code',
      cell: ({ value }) => <span className="text-gray-600 font-medium font-mono">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ value }) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[12.5px] font-semibold border select-none ${value === 'Active'
          ? 'bg-[#ecfdf5] text-[#027a48] border-[#d1fae5]'
          : 'bg-[#f9fafb] text-[#344054] border-[#eaecf0]'
          }`}>
          {value}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: 'created_at',
      header: 'Created',
      accessorKey: 'created_at',
      cell: ({ value }) => (
        <span className="text-gray-600 font-medium">
          {formatDate(value)}
        </span>
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
      {isLoading ? (
        <div className="w-full bg-white border border-neutral-200/80 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F9FAFB]">
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px', width: '38%' }}>Name</th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px', width: '20%' }}>Code</th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px', width: '18%' }}>Status</th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px', width: '14%' }}>Created</th>
                <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold text-right" style={{ padding: '12px 20px', width: '10%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="border-b border-gray-55 bg-white animate-pulse">
                  <td className="px-6 py-5.5"><div className="h-4 bg-neutral-100 rounded w-28"></div></td>
                  <td className="px-6 py-5.5"><div className="h-4 bg-neutral-100 rounded w-16"></div></td>
                  <td className="px-6 py-5.5"><div className="h-6 bg-neutral-100 rounded-lg w-16"></div></td>
                  <td className="px-6 py-5.5"><div className="h-4 bg-neutral-100 rounded w-20"></div></td>
                  <td className="px-6 py-5.5 text-right"><div className="h-7 bg-neutral-100 rounded-lg w-7 ml-auto"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <DataTable
          data={payments}
          columns={columns}
          searchPlaceholder="Search Payments..."
          defaultPageSize={8}
          filterElement={
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#171717] hover:bg-neutral-800 text-white font-semibold text-[13.5px] rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
              </svg>
              <span>Add Payment</span>
            </button>
          }
        />
      )}

      {/* VIEW DETAILS MODAL */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-[#0b0f19]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-125 border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4.5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-neutral-800">Payment Master Details</h3>
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
                <span className="text-gray-400 font-medium">Payment ID</span>
                <span className="col-span-2 text-neutral-800 font-bold">{selectedItem.payment_id}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Name</span>
                <span className="col-span-2 text-neutral-800 font-bold">{selectedItem.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Payment Code</span>
                <span className="col-span-2 text-neutral-800 font-mono font-semibold">{selectedItem.code}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Status</span>
                <span className="col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[12.5px] font-bold ${selectedItem.status === 'Active' ? 'bg-emerald-50 text-[#047857] border border-emerald-200' : 'bg-neutral-50 text-neutral-500 border border-neutral-200'}`}>
                    {selectedItem.status}
                  </span>
                </span>
              </div>
              {selectedItem.created_by && (
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                  <span className="text-gray-400 font-medium">Created By</span>
                  <span className="col-span-2 text-neutral-700">{selectedItem.created_by}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 py-1.5">
                <span className="text-gray-400 font-medium">Created Date</span>
                <span className="col-span-2 text-neutral-700">{formatDate(selectedItem.created_at)}</span>
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
              <h3 className="text-[18px] font-bold text-[#101828]">Add Payment</h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter"
                      disabled={isSubmitting}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter"
                      disabled={isSubmitting}
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-b border-neutral-50">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-[#344054]">Status</span>
                    <span className="text-[12.5px] text-[#667085]">Set the operational status of the payment mode</span>
                  </div>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active',
                      })
                    }
                    className="focus:outline-none cursor-pointer disabled:opacity-50"
                  >
                    <div className={`relative w-13 h-7 rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                      ? 'bg-[#171717] border-[#171717]'
                      : 'bg-[#f2f4f7] border-[#d0d5dd]'
                      }`}>
                      <div className={`absolute top-0.75 left-0.75 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all disabled:opacity-50 inline-flex items-center gap-2"
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
              <h3 className="text-[18px] font-bold text-[#101828]">Edit Payment</h3>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditSave}>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter"
                      disabled={isSubmitting}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Code</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter"
                      disabled={isSubmitting}
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-b border-neutral-50">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-[#344054]">Status</span>
                    <span className="text-[12.5px] text-[#667085]">Set the operational status of the payment mode</span>
                  </div>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active',
                      })
                    }
                    className="focus:outline-none cursor-pointer disabled:opacity-50"
                  >
                    <div className={`relative w-13 h-7 rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                      ? 'bg-[#171717] border-[#171717]'
                      : 'bg-[#f2f4f7] border-[#d0d5dd]'
                      }`}>
                      <div className={`absolute top-0.75 left-0.75 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedItem(null);
                    }}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[14px] font-semibold rounded-xl cursor-pointer transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-[14px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {isSubmitting && (
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-[#0b0f19]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-100 border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-[17px] font-bold text-neutral-800 mb-1">Delete Payment Record</h3>
              <p className="text-[13px] text-gray-500 max-w-70 mx-auto">Are you sure you want to delete this record? This action cannot be undone.</p>
            </div>
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                disabled={isSubmitting}
                className="flex-1 py-2.5 border border-[#d0d5dd] hover:bg-neutral-50 text-[#344054] text-[13.5px] font-semibold rounded-xl cursor-pointer transition-all disabled:opacity-50"
              >
                No, Keep it
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[13.5px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {isSubmitting && (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMasterPage;
