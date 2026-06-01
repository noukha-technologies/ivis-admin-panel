import React, { useState, useEffect, useMemo } from 'react';
import { masterService } from '../../api/services/master.service';
import type { ApiTest } from '../../interfaces/test.interface';
import { getApiErrorMessage } from '../../api/apiResponse';
import { toast } from 'sonner';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { RowActions } from '../../components/ui/RowActions';
import type { ColumnDef } from '../../interfaces/ui.interfaces';
import { PermissionGate } from '../../components/PermissionGate';
import { PERMISSIONS } from '../../constants/permissions';


const TestMasterPage: React.FC = () => {
  const [tests, setTests] = useState<ApiTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal States
  const [selectedItem, setSelectedItem] = useState<ApiTest | null>(null);
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

  // Fetch tests on component mount
  const fetchTests = async () => {
    setIsLoading(true);
    try {
      const result = await masterService.tests.getAll({
        nonPaginated: true,
      });
      setTests(result.data);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to retrieve test records.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
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

  const handleOpenEdit = (item: ApiTest) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      code: item.code,
      status: item.status,
    });
    setShowEditModal(true);
  };

  const handleOpenView = (item: ApiTest) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await masterService.tests.create({
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        status: formData.status,
      });
      setShowNewModal(false);
      resetForm();
      fetchTests();
      toast.success('Test master record created successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to create test record.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsSubmitting(true);

    try {
      await masterService.tests.update(selectedItem.id, {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        status: formData.status,
      });
      setShowEditModal(false);
      setSelectedItem(null);
      fetchTests();
      toast.success('Test master record updated successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update test record.'));
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
      await masterService.tests.delete(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchTests();
      toast.success('Test master record deleted successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to delete test record.'));
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const columns = useMemo<ColumnDef<ApiTest>[]>(() => [
    {
      id: 'test_id',
      header: 'ID',
      accessorKey: 'test_id',
      cell: ({ value }) => (
        <span className="font-semibold text-neutral-500">#{value}</span>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      cell: ({ value }) => <span className="font-semibold text-gray-900">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'code',
      header: 'Code',
      accessorKey: 'code',
      cell: ({ value }) => <span className="text-gray-600 font-semibold font-mono uppercase">{value}</span>,
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
          {new Date(value).toISOString().split('T')[0]}
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
      <DataTable
        data={tests}
        columns={columns}
        loading={isLoading}
        searchPlaceholder="Search manual tests..."
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
            <span>Add Test</span>
          </button>
          </PermissionGate>
        }
      />

      {/* VIEW DETAILS MODAL */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-[#0b0f19]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-125 border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4.5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-neutral-800">Test Master Details</h3>
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
                <span className="text-gray-400 font-medium">Test ID</span>
                <span className="col-span-2 text-neutral-800 font-mono font-bold">#{selectedItem.test_id}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Name</span>
                <span className="col-span-2 text-neutral-800 font-bold">{selectedItem.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Code</span>
                <span className="col-span-2 text-neutral-800 font-mono font-semibold uppercase">{selectedItem.code}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Status</span>
                <span className="col-span-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[12.5px] font-bold ${selectedItem.status === 'Active' ? 'bg-emerald-50 text-[#047857]' : 'bg-neutral-100 text-neutral-500'}`}>
                    {selectedItem.status}
                  </span>
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
              <h3 className="text-[18px] font-bold text-[#101828]">Add Test</h3>
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
                  <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter"
                    value={formData.name || ''}
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
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm uppercase font-mono"
                  />
                </div>

                <div className="flex items-center gap-3 py-2 border-t border-b border-neutral-50">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active',
                      })
                    }
                    className="focus:outline-none cursor-pointer flex items-center gap-3"
                  >
                    <div className={`relative w-13 h-7 rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                      ? 'bg-[#171717] border-[#171717]'
                      : 'bg-[#f2f4f7] border-[#d0d5dd]'
                      }`}>
                      <div className={`absolute top-0.75 left-0.75 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                    </div>
                    <span className="text-[14px] font-semibold text-[#344054]">Active</span>
                  </button>
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
                  <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter"
                    value={formData.name || ''}
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
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#d0d5dd] rounded-xl text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-400 transition-all shadow-sm uppercase font-mono"
                  />
                </div>

                <div className="flex items-center gap-3 py-2 border-t border-b border-neutral-50">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        status: formData.status === 'Active' ? 'Inactive' : 'Active',
                      })
                    }
                    className="focus:outline-none cursor-pointer flex items-center gap-3"
                  >
                    <div className={`relative w-13 h-7 rounded-full transition-colors duration-200 ease-in-out border ${formData.status === 'Active'
                      ? 'bg-[#171717] border-[#171717]'
                      : 'bg-[#f2f4f7] border-[#d0d5dd]'
                      }`}>
                      <div className={`absolute top-0.75 left-0.75 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                    </div>
                    <span className="text-[14px] font-semibold text-[#344054]">Active</span>
                  </button>
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
              <h3 className="text-[17px] font-bold text-neutral-800 mb-1">Delete Test Master</h3>
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

export default TestMasterPage;
