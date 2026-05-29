import React, { useState, useEffect, useRef } from 'react';
import { useUsers } from '../../features/users/hooks/useUsers';
import { FilterDropdown } from '../../components/ui/FilterDropdown';
import { useRoles } from '../../features/users/hooks/useRoles';
import { usePermissions } from '../../hooks/usePermissions';
import { userFormFromListItem } from '../../features/users/mappers';
import type { UserFormData, UserListItem, RoleListItem, RoleFormData } from '../../features/users/types';
import { emptyUserForm, emptyRoleForm } from '../../features/users/types';
import { DataTable } from '../../components/ui/DataTable';
import type { ColumnDef } from '../../interfaces/ui.interfaces';
import { masterService } from '../../api/services/master.service';

const UsersPage: React.FC = () => {
  const { canCreateUsers, canEditUsers } = usePermissions();
  const usersHook = useUsers();
  const rolesHook = useRoles();

  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const userColumns: ColumnDef<UserListItem>[] = [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      cell: ({ value }) => (
        <span className="font-bold text-[#101828]">{value}</span>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
      cell: ({ value }) => <span className="text-[#475467] font-normal">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'centre',
      header: 'Centre',
      accessorKey: 'centre',
      cell: ({ value }) => <span className="text-[#475467] font-normal">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'line',
      header: 'Line',
      accessorKey: 'line',
      cell: ({ value }) => <span className="text-[#475467] font-normal">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ value }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium border select-none ${value === 'Active'
          ? 'bg-[#ecfdf5] text-[#027a48] border-[#abf0cd]'
          : 'bg-[#f9fafb] text-[#344054] border-[#eaecf0]'
          }`}>
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
                <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="currentColor" />
                <circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="currentColor" />
                <circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="currentColor" />
              </svg>
            </button>

            {isDropdownActive && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-9 w-44 bg-white border border-neutral-200 rounded-xl shadow-lg py-1.5 z-50 animate-fadeInMenu text-left"
              >
                <button
                  onClick={() => handleOpenView(row)}
                  className="w-full text-left px-4 py-2 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>View Details</span>
                </button>
                {canEditUsers && (
                  <button
                    onClick={() => handleOpenEdit(row)}
                    className="w-full text-left px-4 py-2 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                    <span>Edit User</span>
                  </button>
                )}
                {canEditUsers && (
                  <>
                    <div className="h-px bg-neutral-100 my-1"></div>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="w-full text-left px-4 py-2 text-[13px] font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        );
      }
    }
  ];
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [roleToEdit, setRoleToEdit] = useState<RoleListItem | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [sortAsc] = useState<boolean | null>(true);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    status: [],
    role: [],
    centre: [],
  });

  const [formData, setFormData] = useState<UserFormData>(emptyUserForm());
  const [roleFormData, setRoleFormData] = useState<RoleFormData>(emptyRoleForm());
  const [formError, setFormError] = useState<string | null>(null);

  const [centreOptions, setCentreOptions] = useState<{ id: string; name: string }[]>([]);
  const [lineOptions, setLineOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const centresRes = await masterService.centres.getAll({ nonPaginated: true });
        const linesRes = await masterService.lines.getAll({ nonPaginated: true });
        setCentreOptions(
          centresRes.data
            .filter((c) => c.status === 'Active')
            .map((c) => ({ id: c.id, name: c.name }))
        );
        setLineOptions(
          linesRes.data
            .filter((l) => l.status === 'Active')
            .map((l) => ({ id: l.id, name: l.name }))
        );
      } catch (err) {
        console.error('Failed to load center or line options:', err);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleOpenAdd = () => {
    setFormData(emptyUserForm());
    setFormError(null);
    setShowNewModal(true);
  };

  const handleOpenEdit = (user: UserListItem) => {
    setSelectedUser(user);
    setFormData(userFormFromListItem(user));
    setFormError(null);
    setShowEditModal(true);
    setActiveDropdownId(null);
  };

  const handleOpenView = (user: UserListItem) => {
    setSelectedUser(user);
    setShowViewModal(true);
    setActiveDropdownId(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    const userId = parseInt(formData.user_id, 10);
    if (!userId || userId < 1) {
      setFormError('User ID must be a positive number');
      return;
    }

    const selectedRole = rolesHook.roles.find((r) => r.name === formData.role);
    const roleId = selectedRole ? selectedRole.role_id : undefined;

    const ok = await usersHook.createUser(formData, roleId);
    if (ok) setShowNewModal(false);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormError(null);

    const selectedRole = rolesHook.roles.find((r) => r.name === formData.role);
    const roleId = selectedRole ? selectedRole.role_id : undefined;

    const ok = await usersHook.updateUser(selectedUser.id, formData, roleId);
    if (ok) {
      setShowEditModal(false);
      setSelectedUser(null);
    }
  };

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
    setActiveDropdownId(null);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      const ok = await usersHook.deleteUser(userToDelete);
      if (ok) {
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    }
  };

  const sortedUsers = [...usersHook.users].sort((a, b) => {
    if (sortAsc === null) return 0;
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) return sortAsc ? -1 : 1;
    if (nameA > nameB) return sortAsc ? 1 : -1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter((user) => {
    if (activeFilters.status && activeFilters.status.length > 0) {
      if (!activeFilters.status.includes(user.status)) return false;
    }
    if (activeFilters.role && activeFilters.role.length > 0) {
      if (!activeFilters.role.includes(user.role)) return false;
    }
    if (activeFilters.centre && activeFilters.centre.length > 0) {
      if (!activeFilters.centre.includes(user.centre)) return false;
    }
    return true;
  });

  const handleOpenNewRole = () => {
    setRoleFormData(emptyRoleForm());
    setFormError(null);
    setShowNewRoleModal(true);
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!roleFormData.role_name.trim()) {
      setFormError('Role name is required');
      return;
    }
    const ok = await rolesHook.createRole(roleFormData);
    if (ok) setShowNewRoleModal(false);
  };

  const handleEditRoleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleToEdit) return;
    setFormError(null);
    const ok = await rolesHook.updateRole(roleToEdit.id, roleFormData);
    if (ok) {
      setShowEditRoleModal(false);
      setRoleToEdit(null);
    }
  };

  const confirmDeleteRole = async () => {
    if (roleToDelete) {
      const ok = await rolesHook.deleteRole(roleToDelete);
      if (ok) {
        setShowDeleteRoleModal(false);
        setRoleToDelete(null);
      }
    }
  };

  const displayError = formError || usersHook.error || rolesHook.error;
  const isLoading = activeTab === 'users' ? usersHook.isLoading : rolesHook.isLoading;
  const isSubmitting = usersHook.isSubmitting || rolesHook.isSubmitting;

  const tabSwitcher = (
    <div className="inline-flex items-center border border-neutral-200 bg-[#f9fafb] p-1 rounded-xl shrink-0 gap-1 select-none">
      <button
        onClick={() => setActiveTab('users')}
        className={`px-4 py-1.5 text-[13.5px] font-semibold transition-all cursor-pointer rounded-lg ${
          activeTab === 'users'
            ? 'bg-white text-neutral-800 border border-neutral-200/80 shadow-sm'
            : 'text-neutral-500 hover:text-neutral-800'
        }`}
      >
        Users
      </button>
      <button
        onClick={() => setActiveTab('roles')}
        className={`px-4 py-1.5 text-[13.5px] font-semibold transition-all cursor-pointer rounded-lg ${
          activeTab === 'roles'
            ? 'bg-white text-neutral-800 border border-neutral-200/80 shadow-sm'
            : 'text-neutral-500 hover:text-neutral-800'
        }`}
      >
        Roles
      </button>
    </div>
  );

  return (
    <div className="w-full flex flex-col pt-3 pb-8">
      {/* Title Header Row */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[#101828] leading-tight mb-1">Users & Roles</h1>
        </div>

        {/* Primary Action Button aligned to the right corner */}
        {activeTab === 'users' ? (
          canCreateUsers && (
            <button
              onClick={handleOpenAdd}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#101828] hover:bg-neutral-800 text-white font-semibold text-[13.5px] rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-60"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
              </svg>
              <span>New User</span>
            </button>
          )
        ) : (
          canCreateUsers && (
            <button
              onClick={handleOpenNewRole}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#101828] hover:bg-neutral-800 text-white font-semibold text-[13.5px] rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-60"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
              </svg>
              <span>New Role</span>
            </button>
          )
        )}
      </div>

      {displayError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3.5 text-sm text-red-600 border border-red-200">
          {displayError}
        </div>
      )}

      {activeTab === 'users' ? (
        /* Users Table Grid using global generic DataTable */
        <div className="w-full">
          {isLoading ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white border border-neutral-200/90 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)]">
              <p className="text-[15px] font-semibold text-[#1e293b]">Loading users...</p>
            </div>
          ) : (
            <DataTable
              data={filteredUsers}
              columns={userColumns}
              searchPlaceholder="Search users..."
              leftElement={tabSwitcher}
              filterElement={
                <FilterDropdown
                  align="right"
                  fields={[
                    {
                      id: 'status',
                      label: 'Status',
                      type: 'select',
                      selectType: 'single',
                      options: [
                        { label: 'Active', value: 'Active' },
                        { label: 'Inactive', value: 'Inactive' }
                      ],
                      value: activeFilters.status
                    },
                    {
                      id: 'role',
                      label: 'Role',
                      type: 'select',
                      selectType: 'multiple',
                      options: rolesHook.roles.map(r => ({ label: r.name, value: r.name })),
                      value: activeFilters.role
                    },
                    {
                      id: 'centre',
                      label: 'Centre',
                      type: 'select',
                      selectType: 'single',
                      options: centreOptions.map(c => ({ label: c.name, value: c.name })),
                      value: activeFilters.centre
                    }
                  ]}
                  onChange={(updated) => setActiveFilters(updated)}
                />
              }
            />
          )}
        </div>
      ) : (
        /* Roles Area */
        <div className="w-full flex flex-col gap-4">
          {/* Top Control Row */}
          <div className="flex items-center justify-between flex-wrap gap-3 w-full">
            <div>{tabSwitcher}</div>
            <div className="relative w-full max-w-72">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search roles..."
                value={rolesHook.searchQuery}
                onChange={(e) => rolesHook.setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-[13.5px] bg-white border border-neutral-200 rounded-xl placeholder-[#667085] text-[#1f2937] focus:outline-none focus:border-neutral-400 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Roles Table Bordered Card */}
          <div className="w-full bg-white border border-neutral-200/90 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="w-full overflow-x-auto">
              {isLoading ? (
                <div className="w-full py-16 flex flex-col items-center justify-center text-center">
                  <p className="text-[15px] font-semibold text-[#1e293b]">Loading roles...</p>
                </div>
              ) : rolesHook.roles.length === 0 ? (
                <div className="w-full py-16 flex flex-col items-center justify-center text-center">
                  <p className="text-[15px] font-semibold text-[#1e293b] mb-0.5">No Roles Found</p>
                  <p className="text-[13px] text-[#64748b]">Try adjusting your search filters.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-[#FCFCFD]">
                      <th className="px-6 py-3.5 text-[12.5px] text-[#667085] font-semibold w-[25%]">Role</th>
                      <th className="px-6 py-3.5 text-[12.5px] text-[#667085] font-semibold w-[45%]">Description</th>
                      <th className="px-6 py-3.5 text-[12.5px] text-[#667085] font-semibold w-[20%]">Created</th>
                      <th className="px-6 py-3.5 text-[12.5px] text-[#667085] font-semibold text-right w-[10%]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rolesHook.roles.map((role) => (
                      <tr key={role.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 bg-white transition-colors duration-150">
                        <td className="px-6 py-4.5 text-[14px] font-bold text-[#101828]">{role.name}</td>
                        <td className="px-6 py-4.5 text-[14px] text-[#475467] font-normal">{role.description}</td>
                        <td className="px-6 py-4.5 text-[14px] text-[#475467] font-normal">{role.created}</td>
                        <td className="px-6 py-4.5 text-right relative">
                          <button
                            onClick={() => setActiveDropdownId(activeDropdownId === `role-${role.id}` ? null : `role-${role.id}`)}
                            className="w-8 h-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-[#98a2b3] hover:text-[#475467] transition-all cursor-pointer ml-auto"
                          >
                            <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="currentColor" />
                              <circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="currentColor" />
                              <circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="currentColor" />
                            </svg>
                          </button>

                          {activeDropdownId === `role-${role.id}` && (
                            <div
                              ref={dropdownRef}
                              className="absolute right-6 top-10 w-44 bg-white border border-neutral-200 rounded-xl shadow-lg py-1.5 z-50 animate-fadeInMenu text-left"
                            >
                              {canEditUsers && (
                                <button
                                  onClick={() => {
                                    setRoleToEdit(role);
                                    setRoleFormData({ role_name: role.name, description: role.description === '—' ? '' : role.description });
                                    setFormError(null);
                                    setShowEditRoleModal(true);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                  </svg>
                                  <span>Edit Role</span>
                                </button>
                              )}
                              {canEditUsers && (
                                <>
                                  <div className="h-px bg-neutral-100 my-1"></div>
                                  <button
                                    onClick={() => {
                                      setRoleToDelete(role.id);
                                      setShowDeleteRoleModal(true);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-[13px] font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                                  >
                                    <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    <span>Delete</span>
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Redesigned Premium Pagination Footer Bar (Roles Tab) */}
            <div className="flex items-center justify-between px-6 py-4.5 border-t border-neutral-100 bg-white">
              {/* Left count text */}
              <span className="text-[13.5px] text-[#475467] font-semibold">
                Showing {rolesHook.roles.length} of {rolesHook.total} row(s).
              </span>

              {/* Right pagination controls */}
              <div className="flex items-center gap-6">
                {/* Rows per page */}
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] text-[#475467] font-semibold">Rows per page</span>
                  <div className="relative shrink-0">
                    <select
                      disabled
                      value={50}
                      className="appearance-none pl-3 pr-8 py-1.5 text-[13.5px] font-semibold border border-neutral-200 rounded-xl bg-white text-[#1f2937] shadow-sm outline-none cursor-not-allowed"
                    >
                      <option value={50}>50</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Page indicator */}
                <span className="text-[13.5px] text-[#475467] font-semibold shrink-0">
                  Page {rolesHook.page} of {Math.ceil(rolesHook.total / 50) || 1}
                </span>

                {/* Arrow control buttons */}
                <div className="flex items-center gap-1.5">
                  {/* First Page << */}
                  <button
                    disabled={rolesHook.page <= 1}
                    onClick={() => rolesHook.setPage(1)}
                    className="w-8 h-8 flex items-center justify-center border border-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50/80 transition-all cursor-pointer shadow-sm bg-white"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                    </svg>
                  </button>

                  {/* Previous Page < */}
                  <button
                    disabled={rolesHook.page <= 1}
                    onClick={() => rolesHook.setPage(rolesHook.page - 1)}
                    className="w-8 h-8 flex items-center justify-center border border-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50/80 transition-all cursor-pointer shadow-sm bg-white"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>

                  {/* Next Page > */}
                  <button
                    disabled={rolesHook.page >= Math.ceil(rolesHook.total / 50)}
                    onClick={() => rolesHook.setPage(rolesHook.page + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50/80 transition-all cursor-pointer shadow-sm bg-white"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>

                  {/* Last Page >> */}
                  <button
                    disabled={rolesHook.page >= Math.ceil(rolesHook.total / 50)}
                    onClick={() => rolesHook.setPage(Math.ceil(rolesHook.total / 50) || 1)}
                    className="w-8 h-8 flex items-center justify-center border border-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50/80 transition-all cursor-pointer shadow-sm bg-white"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.625L11.625 12 5.25 18.375m7.5-12.75L19.125 12 12.75 18.375" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New User Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl w-105 p-6 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[17px] font-bold text-slate-800">New User</h3>
              <button onClick={() => setShowNewModal(false)} className="rounded-full hover:bg-slate-100 p-1 flex items-center justify-center text-slate-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">User Code *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  placeholder="e.g. 1001"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 placeholder:text-slate-400 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 placeholder:text-slate-400 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@ivis.gov.om"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 placeholder:text-slate-400 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Password *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 8 characters"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 placeholder:text-slate-400 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Role *</label>
                {rolesHook.roleOptions.length > 0 ? (
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] bg-white focus:outline-none focus:border-slate-400 text-slate-800"
                  >
                    <option value="" disabled>Select role</option>
                    {rolesHook.roleOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. admin"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 text-slate-800"
                  />
                )}
              </div>

              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Centre</label>
                <select
                  value={formData.centre}
                  onChange={(e) => setFormData({ ...formData, centre: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] bg-white focus:outline-none focus:border-slate-400 text-slate-800"
                >
                  <option value="">Select (optional)</option>
                  {centreOptions.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Line</label>
                <select
                  value={formData.line}
                  onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] bg-white focus:outline-none focus:border-slate-400 text-slate-800"
                >
                  <option value="">Select (optional)</option>
                  {lineOptions.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}

              <div className="flex items-center justify-end gap-3 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-6 py-2 border border-slate-200 hover:bg-slate-50 font-semibold text-[13.5px] text-slate-700 rounded-lg transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#1f2937] hover:bg-[#111827] text-white font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl w-105 p-6 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[17px] font-bold text-slate-800">Edit User</h3>
              <button onClick={() => setShowEditModal(false)} className="rounded-full hover:bg-slate-100 p-1 flex items-center justify-center text-slate-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 placeholder:text-slate-400 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Role *</label>
                {rolesHook.roleOptions.length > 0 ? (
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] bg-white focus:outline-none focus:border-slate-400 text-slate-800"
                  >
                    <option value="" disabled>Select role</option>
                    {rolesHook.roleOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 text-slate-800"
                  />
                )}
              </div>

              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Centre</label>
                <select
                  value={formData.centre}
                  onChange={(e) => setFormData({ ...formData, centre: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] bg-white focus:outline-none focus:border-slate-400 text-slate-800"
                >
                  <option value="">Select (optional)</option>
                  {centreOptions.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Line</label>
                <select
                  value={formData.line}
                  onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] bg-white focus:outline-none focus:border-slate-400 text-slate-800"
                >
                  <option value="">Select (optional)</option>
                  {lineOptions.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}

              <div className="flex items-center justify-end gap-3 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border border-slate-200 hover:bg-slate-50 font-semibold text-[13.5px] text-slate-700 rounded-lg transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#1f2937] hover:bg-[#111827] text-white font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl w-100 p-6 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="mb-4">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="48" height="48" rx="24" fill="#FEE4E2" style={{ fill: '#FEE4E2', fillOpacity: 1 }} />
                <rect x="4" y="4" width="48" height="48" rx="24" stroke="#FEF3F2" style={{ stroke: '#FEF3F2', strokeOpacity: 1 }} strokeWidth="8" />
                <path d="M28 24V28M28 32H28.01M38 28C38 33.5228 33.5228 38 28 38C22.4772 38 18 33.5228 18 28C18 22.4772 22.4772 18 28 18C33.5228 18 38 22.4772 38 28Z" stroke="#D92D20" style={{ stroke: '#D92D20', strokeOpacity: 1 }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-slate-900 mb-2">Delete User</h3>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to delete this User? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-50 font-semibold text-[14px] text-slate-700 rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-[#fee2e2] hover:bg-[#fca5a5] border border-[#f87171] text-[#dc2626] font-semibold text-[14px] rounded-lg transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Role Modal */}
      {showNewRoleModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl w-125 p-6 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[17px] font-bold text-slate-800">New Role</h3>
              <button onClick={() => setShowNewRoleModal(false)} className="rounded-full hover:bg-slate-100 p-1 flex items-center justify-center text-slate-600 transition-colors cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Role Name *</label>
                <input
                  type="text"
                  required
                  value={roleFormData.role_name}
                  onChange={(e) => setRoleFormData({ ...roleFormData, role_name: e.target.value })}
                  placeholder="e.g. admin"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 placeholder:text-slate-400 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Description</label>
                <textarea
                  value={roleFormData.description}
                  onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                  placeholder="Optional description"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 text-slate-800"
                />
              </div>
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div className="flex items-center justify-end gap-3 pt-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowNewRoleModal(false)}
                  className="px-6 py-2 border border-slate-200 hover:bg-slate-50 font-semibold text-[13.5px] text-slate-700 rounded-lg transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#1f2937] hover:bg-[#111827] text-white font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditRoleModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl w-125 p-6 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[17px] font-bold text-slate-800">Edit Role</h3>
              <button onClick={() => setShowEditRoleModal(false)} className="rounded-full hover:bg-slate-100 p-1 flex items-center justify-center text-slate-600 transition-colors cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditRoleSave} className="space-y-4">
              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Role Name *</label>
                <input
                  type="text"
                  required
                  value={roleFormData.role_name}
                  onChange={(e) => setRoleFormData({ ...roleFormData, role_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Description</label>
                <textarea
                  value={roleFormData.description}
                  onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 text-slate-800"
                />
              </div>
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div className="flex items-center justify-end gap-3 pt-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowEditRoleModal(false)}
                  className="px-6 py-2 border border-slate-200 hover:bg-slate-50 font-semibold text-[13.5px] text-slate-700 rounded-lg transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#1f2937] hover:bg-[#111827] text-white font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Role Modal */}
      {showDeleteRoleModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl w-100 p-6 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="mb-4">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="48" height="48" rx="24" fill="#FEE4E2" style={{ fill: '#FEE4E2', fillOpacity: 1 }} />
                <rect x="4" y="4" width="48" height="48" rx="24" stroke="#FEF3F2" style={{ stroke: '#FEF3F2', strokeOpacity: 1 }} strokeWidth="8" />
                <path d="M28 24V28M28 32H28.01M38 28C38 33.5228 33.5228 38 28 38C22.4772 38 18 33.5228 18 28C18 22.4772 22.4772 18 28 18C33.5228 18 38 22.4772 38 28Z" stroke="#D92D20" style={{ stroke: '#D92D20', strokeOpacity: 1 }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-slate-900 mb-2">Delete Role</h3>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to delete this Role? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowDeleteRoleModal(false);
                  setRoleToDelete(null);
                }}
                className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-50 font-semibold text-[14px] text-slate-700 rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteRole}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-[#fee2e2] hover:bg-[#fca5a5] border border-[#f87171] text-[#dc2626] font-semibold text-[14px] rounded-lg transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-120 p-6 shadow-2xl border border-neutral-100">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-[18px] font-bold text-gray-900">{selectedUser.name}</h3>
                <p className="text-[12px] text-gray-500 mt-0.5">ID: {selectedUser.userId}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-gray-500 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="block text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Email Address</span>
                <span className="text-[15px] font-medium text-neutral-800">{selectedUser.email}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[12px] font-bold text-neutral-400 uppercase tracking-wider">User Role</span>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[12px] font-bold bg-neutral-100 text-neutral-800">{selectedUser.role}</span>
                </div>
                <div>
                  <span className="block text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Status</span>
                  <span className={`inline-flex items-center mt-1 px-3 py-1 rounded-lg text-[12.5px] font-semibold border select-none ${selectedUser.status === 'Active'
                    ? 'bg-[#ecfdf5] text-[#027a48] border-[#d1fae5]'
                    : 'bg-[#f9fafb] text-[#344054] border-[#eaecf0]'
                    }`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Assigned Center</span>
                  <span className="text-[15px] font-medium text-neutral-800">{selectedUser.centre}</span>
                </div>
                <div>
                  <span className="block text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Line</span>
                  <span className="text-[15px] font-medium text-neutral-800">{selectedUser.line}</span>
                </div>
              </div>
              <div>
                <span className="block text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Registered Since</span>
                <span className="text-[15px] font-medium text-neutral-800">{selectedUser.created}</span>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-neutral-100 mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-5 py-2.5 bg-[#171717] hover:bg-neutral-800 text-white font-medium text-[13px] rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
