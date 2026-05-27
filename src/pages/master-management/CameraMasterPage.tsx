import React, { useState, useEffect, useRef } from 'react';
import { masterService } from '../../api/services/master.service';
import type { ApiCamera } from '../../interfaces/camera.interface';
import type { ApiLine } from '../../interfaces/line.interface';
import { getApiErrorMessage } from '../../api/apiResponse';
import type { PaginationMeta } from '../../types/api.types';
import { toast } from 'react-hot-toast';

const CameraMasterPage: React.FC = () => {
  const [cameras, setCameras] = useState<ApiCamera[]>([]);
  const [lines, setLines] = useState<ApiLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search, Pagination and Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortAsc, setSortAsc] = useState<boolean>(false); // default descending (newest first)
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const ITEMS_PER_PAGE = 8;
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Modal States
  const [selectedItem, setSelectedItem] = useState<ApiCamera | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'ANPR',
    line_id: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch active lines for the dropdown select options
  const fetchLines = async () => {
    try {
      const response = await masterService.lines.getAll({ nonPaginated: true });
      setLines(response.data);
    } catch (err) {
      toast.error('Failed to load lines list for dropdown.');
    }
  };

  // Fetch cameras on filter/pagination changes
  const fetchCameras = async () => {
    setIsLoading(true);
    try {
      const result = await masterService.cameras.getAll({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortAsc ? 'ASC' : 'DESC',
      });
      setCameras(result.data);
      setMeta(result.meta);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to retrieve Camera records.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLines();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy, sortAsc]);

  useEffect(() => {
    fetchCameras();
  }, [currentPage, debouncedSearch, sortBy, sortAsc]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      type: 'ANPR',
      line_id: lines[0]?.id || '',
      description: '',
      status: 'Active',
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowNewModal(true);
  };

  const handleOpenEdit = (item: ApiCamera) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      code: item.code,
      type: item.type,
      line_id: item.line_id,
      description: item.description || '',
      status: item.status,
    });
    setShowEditModal(true);
    setActiveDropdownId(null);
  };

  const handleOpenView = (item: ApiCamera) => {
    setSelectedItem(item);
    setShowViewModal(true);
    setActiveDropdownId(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.line_id) {
      toast.error('Please assign a Line.');
      return;
    }
    setIsSubmitting(true);

    try {
      await masterService.cameras.create({
        name: formData.name.trim(),
        code: formData.code.trim(),
        type: formData.type.trim(),
        line_id: formData.line_id,
        description: formData.description.trim() || undefined,
        status: formData.status,
      });
      setShowNewModal(false);
      resetForm();
      fetchCameras();
      toast.success('Camera master record created successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to create Camera record.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    if (!formData.line_id) {
      toast.error('Please assign a Line.');
      return;
    }
    setIsSubmitting(true);

    try {
      await masterService.cameras.update(selectedItem.id, {
        name: formData.name.trim(),
        code: formData.code.trim(),
        type: formData.type.trim(),
        line_id: formData.line_id,
        description: formData.description.trim() || undefined,
        status: formData.status,
      });
      setShowEditModal(false);
      setSelectedItem(null);
      fetchCameras();
      toast.success('Camera master record updated successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update Camera record.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
    setActiveDropdownId(null);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await masterService.cameras.delete(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchCameras();
      toast.success('Camera record deleted successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to delete Camera record.'));
      setShowDeleteModal(false);
    }
  };

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column);
      setSortAsc(true);
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

  return (
    <div className="w-full flex flex-col">
      {/* Search bar & Action Button */}
      <div className="mb-5 flex items-center justify-end flex-wrap gap-4">
        <div className="relative w-full max-w-85">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-[14px] bg-white border border-neutral-200 rounded-xl placeholder-gray-400 focus:outline-none focus:border-neutral-400 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13.5px] font-semibold rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-sm hover:shadow transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add Camera</span>
        </button>
      </div>

      {/* Main Table Grid Card */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          {isLoading && cameras.length === 0 ? (
            <div className="w-full min-h-75 flex flex-col p-6 space-y-4 justify-center">
              <div className="h-5 bg-neutral-100 rounded animate-pulse w-3/4"></div>
              <div className="h-10 bg-neutral-50 rounded animate-pulse w-full"></div>
              <div className="h-10 bg-neutral-100/70 rounded animate-pulse w-full"></div>
              <div className="h-10 bg-neutral-50 rounded animate-pulse w-full"></div>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-neutral-50/70 border-b border-neutral-200/80 select-none">
                  <th
                    onClick={() => toggleSort('name')}
                    className="px-5 py-3 text-[14px] text-[#667085] font-semibold cursor-pointer select-none hover:text-neutral-900 transition-colors"
                    style={{ padding: '12px 20px', width: '22%' }}
                  >
                    <span className="inline-flex items-center gap-1">
                      Name
                      {sortBy === 'name' && (
                        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${sortAsc ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </span>
                  </th>
                  <th
                    onClick={() => toggleSort('code')}
                    className="px-5 py-3 text-[14px] text-[#667085] font-semibold cursor-pointer select-none hover:text-neutral-900 transition-colors"
                    style={{ padding: '12px 20px', width: '13%' }}
                  >
                    <span className="inline-flex items-center gap-1">
                      Code
                      {sortBy === 'code' && (
                        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${sortAsc ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </span>
                  </th>
                  <th
                    onClick={() => toggleSort('type')}
                    className="px-5 py-3 text-[14px] text-[#667085] font-semibold cursor-pointer select-none hover:text-neutral-900 transition-colors"
                    style={{ padding: '12px 20px', width: '18%' }}
                  >
                    <span className="inline-flex items-center gap-1">
                      Type
                      {sortBy === 'type' && (
                        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${sortAsc ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </span>
                  </th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px', width: '17%' }}>Line</th>
                  <th
                    onClick={() => toggleSort('status')}
                    className="px-5 py-3 text-[14px] text-[#667085] font-semibold cursor-pointer select-none hover:text-neutral-900 transition-colors"
                    style={{ padding: '12px 20px', width: '10%' }}
                  >
                    <span className="inline-flex items-center gap-1">
                      Status
                      {sortBy === 'status' && (
                        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${sortAsc ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </span>
                  </th>
                  <th
                    onClick={() => toggleSort('created_at')}
                    className="px-5 py-3 text-[14px] text-[#667085] font-semibold cursor-pointer select-none hover:text-neutral-900 transition-colors"
                    style={{ padding: '12px 20px', width: '10%' }}
                  >
                    <span className="inline-flex items-center gap-1">
                      Created
                      {sortBy === 'created_at' && (
                        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${sortAsc ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </span>
                  </th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold text-right" style={{ padding: '12px 20px', width: '10%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cameras.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center bg-white">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 mb-3 border border-neutral-100">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <p className="text-[14.5px] font-semibold text-[#1e293b] mb-0.5">No Master Records Found</p>
                        <p className="text-[13px] text-[#64748b] leading-relaxed">No entries match your search query or database filter.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  cameras.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 transition-colors duration-150 hover:bg-gray-50/80 bg-white group">
                      <td className="px-6 py-4.5 text-sm font-semibold text-gray-900">{item.name}</td>
                      <td className="px-6 py-4.5 text-sm text-gray-600 font-medium font-mono">{item.code}</td>
                      <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">{item.type}</td>
                      <td className="px-6 py-4.5 text-sm text-gray-600 font-semibold">{item.line?.name || '—'}</td>
                      <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[12.5px] font-semibold border select-none ${item.status === 'Active'
                          ? 'bg-[#ecfdf5] text-[#027a48] border-[#d1fae5]'
                          : 'bg-[#f9fafb] text-[#344054] border-[#eaecf0]'
                          }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">{formatDate(item.created_at)}</td>
                      <td className="px-6 py-4.5 text-right relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(activeDropdownId === item.id ? null : item.id);
                          }}
                          className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors inline-flex cursor-pointer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>

                        {activeDropdownId === item.id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-6 mt-1 w-38 bg-white border border-neutral-200 rounded-xl shadow-lg py-1.5 z-40 text-left"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleOpenView(item)}
                              className="w-full px-4 py-2 text-[13px] text-neutral-700 hover:bg-neutral-50 flex items-center gap-2.5 cursor-pointer font-medium"
                            >
                              <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              <span>View Details</span>
                            </button>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="w-full px-4 py-2 text-[13px] text-neutral-700 hover:bg-neutral-50 flex items-center gap-2.5 cursor-pointer font-medium"
                            >
                              <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                              </svg>
                              <span>Edit Record</span>
                            </button>
                            <div className="border-t border-neutral-100 my-1"></div>
                            <button
                              onClick={() => openDeleteModal(item.id)}
                              className="w-full px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer font-semibold"
                            >
                              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination control */}
        {!isLoading && cameras.length > 0 && (
          <div className="px-5 py-4 border-t border-neutral-100 flex items-center justify-between bg-white text-[13.5px]">
            <span className="text-gray-500 font-medium">
              Showing <span className="font-semibold text-neutral-800">{(meta.page - 1) * meta.limit + 1}</span> to{' '}
              <span className="font-semibold text-neutral-800">
                {Math.min(meta.page * meta.limit, meta.total)}
              </span>{' '}
              of <span className="font-semibold text-neutral-800">{meta.total}</span> results
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={!meta.hasPreviousPage || isSubmitting}
                className="px-3 py-1.5 border border-neutral-200 rounded-lg text-gray-500 hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all cursor-pointer font-medium"
              >
                Previous
              </button>
              {Array.from({ length: meta.totalPages }, (_, idx) => idx + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  disabled={isSubmitting}
                  className={`w-8.5 h-8.5 rounded-lg font-semibold flex items-center justify-center transition-all cursor-pointer ${currentPage === pg
                    ? 'bg-[#171717] text-white shadow-sm border border-[#171717]'
                    : 'border border-neutral-200 text-gray-500 hover:bg-neutral-50'
                    }`}
                >
                  {pg}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, meta.totalPages))}
                disabled={!meta.hasNextPage || isSubmitting}
                className="px-3 py-1.5 border border-neutral-200 rounded-lg text-gray-500 hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all cursor-pointer font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-[#0b0f19]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-125 border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4.5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-neutral-800">Camera Details</h3>
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
                <span className="text-gray-400 font-medium">Camera ID</span>
                <span className="col-span-2 text-neutral-800 font-bold">{selectedItem.camera_id}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Name</span>
                <span className="col-span-2 text-neutral-800 font-bold">{selectedItem.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Camera Code</span>
                <span className="col-span-2 text-neutral-800 font-mono font-semibold">{selectedItem.code}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Camera Type</span>
                <span className="col-span-2 text-neutral-800 font-mono font-semibold">{selectedItem.type}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Assigned Line</span>
                <span className="col-span-2 text-neutral-800 font-bold">{selectedItem.line?.name || '—'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                <span className="text-gray-400 font-medium">Description</span>
                <span className="col-span-2 text-neutral-700">{selectedItem.description || 'No description provided'}</span>
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
        <div className="fixed inset-0 bg-[#0b0f19]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-120 border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
              <h3 className="text-[18px] font-bold text-[#101828]">Add Camera</h3>
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
              <div className="p-6 space-y-4">
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
                      className="w-full px-3.5 py-2 text-[14px] bg-white border border-neutral-200 rounded-xl placeholder-gray-400 focus:outline-none focus:border-neutral-400 transition-all shadow-sm"
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
                      className="w-full px-3.5 py-2 text-[14px] bg-white border border-neutral-200 rounded-xl placeholder-gray-400 focus:outline-none focus:border-neutral-400 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Type</label>
                    <select
                      required
                      disabled={isSubmitting}
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3.5 py-2 text-[14px] bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-400 transition-all shadow-sm cursor-pointer font-medium text-neutral-800"
                    >
                      <option value="ANPR">ANPR</option>
                      <option value="CCTV">CCTV</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Line</label>
                    <select
                      required
                      disabled={isSubmitting || lines.length === 0}
                      value={formData.line_id}
                      onChange={(e) => setFormData({ ...formData, line_id: e.target.value })}
                      className="w-full px-3.5 py-2 text-[14px] bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-400 transition-all shadow-sm cursor-pointer font-medium text-neutral-800"
                    >
                      {lines.length === 0 ? (
                        <option value="">No active lines available</option>
                      ) : (
                        lines.map((line) => (
                          <option key={line.id} value={line.id}>
                            {line.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                  <textarea
                    placeholder="Enter"
                    disabled={isSubmitting}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3.5 py-2 text-[14px] bg-white border border-neutral-200 rounded-xl placeholder-gray-400 focus:outline-none focus:border-neutral-400 transition-all shadow-sm resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="flex flex-col">
                    <span className="text-[13.5px] font-semibold text-[#344054]">Active Status</span>
                    <span className="text-[12.5px] text-gray-400 font-medium">Control whether this Camera is online.</span>
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      disabled={isSubmitting}
                      checked={formData.status === 'Active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Inactive' })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                  </label>
                </div>
              </div>
              <div className="px-6 py-4.5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  disabled={isSubmitting}
                  className="px-4.5 py-2.5 border border-neutral-200 bg-white hover:bg-neutral-50 text-[13px] font-semibold rounded-xl cursor-pointer transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-1 h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-[#0b0f19]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-120 border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
              <h3 className="text-[18px] font-bold text-[#101828]">Edit Camera</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditSave}>
              <div className="p-6 space-y-4">
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
                      className="w-full px-3.5 py-2 text-[14px] bg-white border border-neutral-200 rounded-xl placeholder-gray-400 focus:outline-none focus:border-neutral-400 transition-all shadow-sm"
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
                      className="w-full px-3.5 py-2 text-[14px] bg-white border border-neutral-200 rounded-xl placeholder-gray-400 focus:outline-none focus:border-neutral-400 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Type</label>
                    <select
                      required
                      disabled={isSubmitting}
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3.5 py-2 text-[14px] bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-400 transition-all shadow-sm cursor-pointer font-medium text-neutral-800"
                    >
                      <option value="ANPR">ANPR</option>
                      <option value="CCTV">CCTV</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Line</label>
                    <select
                      required
                      disabled={isSubmitting || lines.length === 0}
                      value={formData.line_id}
                      onChange={(e) => setFormData({ ...formData, line_id: e.target.value })}
                      className="w-full px-3.5 py-2 text-[14px] bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-400 transition-all shadow-sm cursor-pointer font-medium text-neutral-800"
                    >
                      {lines.length === 0 ? (
                        <option value="">No active lines available</option>
                      ) : (
                        lines.map((line) => (
                          <option key={line.id} value={line.id}>
                            {line.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#344054] mb-1.5">Description</label>
                  <textarea
                    placeholder="Enter"
                    disabled={isSubmitting}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3.5 py-2 text-[14px] bg-white border border-neutral-200 rounded-xl placeholder-gray-400 focus:outline-none focus:border-neutral-400 transition-all shadow-sm resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="flex flex-col">
                    <span className="text-[13.5px] font-semibold text-[#344054]">Active Status</span>
                    <span className="text-[12.5px] text-gray-400 font-medium">Control whether this Camera is online.</span>
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      disabled={isSubmitting}
                      checked={formData.status === 'Active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Inactive' })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                  </label>
                </div>
              </div>
              <div className="px-6 py-4.5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isSubmitting}
                  className="px-4.5 py-2.5 border border-neutral-200 bg-white hover:bg-neutral-50 text-[13px] font-semibold rounded-xl cursor-pointer transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-semibold rounded-xl cursor-pointer shadow-sm transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-1 h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-[#0b0f19]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-110 border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-[16px] font-bold text-neutral-800">Delete Camera Record</h4>
                  <p className="text-[13.5px] text-gray-500 leading-relaxed">
                    Are you sure you want to delete this Camera master record? This action soft-deletes the record and cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4.5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-neutral-200 bg-white hover:bg-neutral-50 text-[13px] font-semibold text-gray-700 rounded-lg cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold rounded-lg cursor-pointer transition-all shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraMasterPage;
