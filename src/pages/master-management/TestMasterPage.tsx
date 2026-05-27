import React, { useState, useEffect, useRef } from 'react';
import { masterService } from '../../api/services/master.service';
import type { ApiTest } from '../../interfaces/test.interface';
import { getApiErrorMessage } from '../../api/apiResponse';
import type { PaginationMeta } from '../../types/api.types';
import { toast } from 'react-hot-toast';

const TestMasterPage: React.FC = () => {
  const [tests, setTests] = useState<ApiTest[]>([]);
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

  // Debounce search query to prevent backend spamming
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch tests on filter/pagination changes
  const fetchTests = async () => {
    setIsLoading(true);
    try {
      const result = await masterService.tests.getAll({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortAsc ? 'ASC' : 'DESC',
      });
      setTests(result.data);
      setMeta(result.meta);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to retrieve test records.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy, sortAsc]);

  useEffect(() => {
    fetchTests();
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
    setActiveDropdownId(null);
  };

  const handleOpenView = (item: ApiTest) => {
    setSelectedItem(item);
    setShowViewModal(true);
    setActiveDropdownId(null);
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
    setActiveDropdownId(null);
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

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Search bar & Action Button */}
      <div className="mb-5 flex items-center justify-between flex-wrap gap-4">
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
            className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-neutral-200 rounded-xl placeholder-gray-400 focus:outline-none focus:border-neutral-400 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white font-medium text-[13.5px] rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
          </svg>
          <span>Add Test</span>
        </button>
      </div>

      {/* Main Table Box */}
      <div className="w-full bg-white border border-neutral-200/80 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="w-full overflow-x-auto">
          {isLoading ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F9FAFB]">
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px', width: '12%' }}>ID</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px', width: '38%' }}>Name</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px', width: '18%' }}>Code</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px', width: '12%' }}>Status</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold" style={{ padding: '12px 20px', width: '12%' }}>Created</th>
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold text-right" style={{ padding: '12px 20px', width: '8%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="border-b border-gray-50 bg-white">
                    <td className="px-6 py-5.5"><div className="h-4 bg-neutral-100 rounded animate-pulse w-10"></div></td>
                    <td className="px-6 py-5.5"><div className="h-4 bg-neutral-100 rounded animate-pulse w-48"></div></td>
                    <td className="px-6 py-5.5"><div className="h-4 bg-neutral-100 rounded animate-pulse w-20"></div></td>
                    <td className="px-6 py-5.5"><div className="h-6.5 bg-neutral-100 rounded-lg animate-pulse w-16"></div></td>
                    <td className="px-6 py-5.5"><div className="h-4 bg-neutral-100 rounded animate-pulse w-24"></div></td>
                    <td className="px-6 py-5.5 text-right"><div className="h-7 bg-neutral-100 rounded-lg animate-pulse w-7 ml-auto"></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : tests.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 mb-3 border border-neutral-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-[15px] font-semibold text-[#1e293b] mb-0.5">No Master Records Found</p>
              <p className="text-[13px] text-[#64748b] max-w-70">No entries match your search query or database filter.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F9FAFB]">
                  <th
                    onClick={() => toggleSort('test_id')}
                    className="px-5 py-3 text-[14px] text-[#667085] font-semibold cursor-pointer select-none hover:text-neutral-900 transition-colors"
                    style={{ padding: '12px 20px', width: '12%' }}
                  >
                    <span className="inline-flex items-center gap-1">
                      ID
                      {sortBy === 'test_id' && (
                        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${sortAsc ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </span>
                  </th>
                  <th
                    onClick={() => toggleSort('name')}
                    className="px-5 py-3 text-[14px] text-[#667085] font-semibold cursor-pointer select-none hover:text-neutral-900 transition-colors"
                    style={{ padding: '12px 20px', width: '38%' }}
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
                    style={{ padding: '12px 20px', width: '18%' }}
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
                    onClick={() => toggleSort('status')}
                    className="px-5 py-3 text-[14px] text-[#667085] font-semibold cursor-pointer select-none hover:text-neutral-900 transition-colors"
                    style={{ padding: '12px 20px', width: '12%' }}
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
                    style={{ padding: '12px 20px', width: '12%' }}
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
                  <th className="px-5 py-3 text-[14px] text-[#667085] font-semibold text-right" style={{ padding: '12px 20px', width: '8%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 transition-colors duration-150 hover:bg-gray-50/80 bg-white group">
                    <td className="px-6 py-4.5 text-sm font-semibold text-neutral-500">#{item.test_id}</td>
                    <td className="px-6 py-4.5 text-sm font-semibold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4.5 text-sm text-gray-600 font-medium font-mono uppercase">{item.code}</td>
                    <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[12.5px] font-semibold border select-none ${item.status === 'Active'
                        ? 'bg-[#ecfdf5] text-[#027a48] border-[#d1fae5]'
                        : 'bg-[#f9fafb] text-[#344054] border-[#eaecf0]'
                        }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-sm text-gray-600 font-medium">
                      {new Date(item.created_at).toISOString().split('T')[0]}
                    </td>
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
                          className="absolute right-6 mt-1 w-36 bg-white border border-neutral-200 rounded-xl shadow-lg py-1.5 z-40 text-left"
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
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination control */}
        {!isLoading && tests.length > 0 && (
          <div className="px-5 py-4 border-t border-neutral-100 flex items-center justify-between bg-white text-[13.5px]">
            <span className="text-gray-500 font-medium">
              Showing <span className="font-semibold text-neutral-800">{(meta.page - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
              <span className="font-semibold text-neutral-800">
                {Math.min(meta.page * ITEMS_PER_PAGE, meta.total)}
              </span>{' '}
              of <span className="font-semibold text-neutral-800">{meta.total}</span> results
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={!meta.hasPreviousPage}
                className="px-3 py-1.5 border border-neutral-200 rounded-lg text-gray-500 hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all cursor-pointer font-medium"
              >
                Previous
              </button>
              {Array.from({ length: meta.totalPages }, (_, idx) => idx + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-8.5 h-8.5 rounded-lg font-semibold flex items-center justify-center transition-all cursor-pointer ${meta.page === pg
                    ? 'bg-[#171717] text-white shadow-sm border border-[#171717]'
                    : 'border border-neutral-200 text-gray-500 hover:bg-neutral-50'
                    }`}
                >
                  {pg}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, meta.totalPages))}
                disabled={!meta.hasNextPage}
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
              <h3 className="text-[18px] font-bold text-[#101828]">Edit Test</h3>
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
