import React, { useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { useUsers } from '../../features/users/hooks/useUsers';
import { FilterDropdown } from '../../components/ui/FilterDropdown';
import { useRoles } from '../../features/users/hooks/useRoles';
import { usePermissions } from '../../hooks/usePermissions';
import { userFormFromListItem } from '../../features/users/mappers';
import type { UserFormData, UserListItem, RoleListItem, RoleFormData } from '../../features/users/types';
import { emptyUserForm, emptyRoleForm } from '../../features/users/types';
import { DataTable } from '../../components/ui/DataTable';
import { RowActions } from '../../components/ui/RowActions';
import { Pencil, Trash2, Eye } from 'lucide-react';
import type { ColumnDef } from '../../interfaces/ui.interfaces';
import { masterService } from '../../api/services/master.service';
import { SideDrawer } from '../../components/ui/SideDrawer';

const UsersPage: React.FC = () => {
  const { canCreateUsers, canEditUsers } = usePermissions();
  const usersHook = useUsers();
  const rolesHook = useRoles();
  const location = useLocation();

  const activeTab = location.pathname === ROUTES.USERS_ROLES ? 'roles' : 'users';
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const userColumns: ColumnDef<UserListItem>[] = [
    {
      id: 'name',
      header: 'User Name',
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
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2 items-center justify-center">
            {value === 'Active' ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </>
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </>
            )}
          </div>
          <span className="text-[13.5px] font-medium text-neutral-700">{value}</span>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <RowActions
          actions={[
            {
              id: 'view',
              label: 'View Details',
              icon: <Eye className="w-4 h-4 text-slate-500" />,
              onClick: () => handleOpenView(row),
            },
            ...(canEditUsers ? [
              {
                id: 'edit',
                label: 'Edit User',
                icon: <Pencil className="w-4 h-4 text-slate-500" />,
                onClick: () => handleOpenEdit(row),
              },
              {
                id: 'delete',
                label: 'Delete',
                icon: <Trash2 className="w-4 h-4 text-rose-500" />,
                onClick: () => handleDelete(row.id),
                variant: 'danger' as const,
              }
            ] : [])
          ]}
        />
      )
    }
  ];

  const roleColumns = useMemo<ColumnDef<RoleListItem>[]>(() => [
    {
      id: 'name',
      header: 'Role',
      accessorKey: 'name',
      cell: ({ value }) => (
        <span className="font-bold text-[#101828]">{value}</span>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: 'description',
      header: 'Description',
      accessorKey: 'description',
      cell: ({ value }) => <span className="text-[#475467] font-normal">{value}</span>,
      enableSorting: false,
    },
    {
      id: 'created',
      header: 'Created',
      accessorKey: 'created',
      cell: ({ value }) => <span className="text-[#475467] font-normal">{value}</span>,
      enableSorting: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row: role }) => (
        <RowActions
          actions={[
            ...(canEditUsers ? [
              {
                id: 'edit',
                label: 'Edit Role',
                icon: <Pencil className="w-4 h-4 text-slate-500" />,
                onClick: () => {
                  setRoleToEdit(role);
                  setRoleFormData({ role_name: role.name, description: role.description === '—' ? '' : role.description });
                  setFormError(null);
                  setShowEditRoleModal(true);
                }
              },
              {
                id: 'delete',
                label: 'Delete',
                icon: <Trash2 className="w-4 h-4 text-rose-500" />,
                onClick: () => {
                  setRoleToDelete(role.id);
                  setShowDeleteRoleModal(true);
                },
                variant: 'danger' as const
              }
            ] : [])
          ]}
        />
      )
    }
  ], [canEditUsers]);

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

  useEffect(() => {
    if (displayError) {
      toast.error(displayError);
    }
  }, [displayError]);

  const tabSwitcher = null;

  const primaryActionButton = activeTab === 'users' ? (
    canCreateUsers && (
      <button
        onClick={handleOpenAdd}
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#101828] hover:bg-neutral-800 text-white font-semibold text-[13.5px] rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-60 whitespace-nowrap shrink-0"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
        </svg>
        <span>Create User</span>
      </button>
    )
  ) : (
    canCreateUsers && (
      <button
        onClick={handleOpenNewRole}
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#101828] hover:bg-neutral-800 text-white font-semibold text-[13.5px] rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-60 whitespace-nowrap shrink-0"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
        </svg>
        <span>Create Role</span>
      </button>
    )
  );


  return (
    <div className="w-full flex flex-col pt-0 pb-8">
      {/* Title Header Row */}


      {activeTab === 'users' ? (
        <DataTable
          data={filteredUsers}
          columns={userColumns}
          loading={isLoading}
          searchPlaceholder="Search by"
          animatedSearchHints={['Name', 'Role', 'Centre', 'line', 'Email', 'Status']}
          rightElement={primaryActionButton}
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
      ) : (
        <DataTable
          data={rolesHook.roles}
          columns={roleColumns}
          loading={isLoading}
          searchPlaceholder="Search roles..."
          leftElement={tabSwitcher}
          defaultPageSize={50}
        />
      )}

      {/* New User Modal */}

      <SideDrawer
        open={showNewModal}
        onOpenChange={setShowNewModal}
        title="Create New User"
        size="sm"
        showCloseButton={false}
        bodyClassName="pt-6"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setShowNewModal(false)}
              className="px-6 py-2 border border-red-500 text-red-500 hover:bg-red-50 font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="new-user-form"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#1f2937] hover:bg-[#111827] text-white font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Confirm'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4" id="new-user-form">

          <div>
            <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">User Code <span className="text-red-500">*</span></label>
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
            <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Name <span className="text-red-500">*</span></label>
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
            <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Email <span className="text-red-500">*</span></label>
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
            <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Password <span className="text-red-500">*</span></label>
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
            <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Role <span className="text-red-500">*</span></label>
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


        </form>
      </SideDrawer>

      {/* Edit User Modal */}

      <SideDrawer
        open={showEditModal && !!selectedUser}
        onOpenChange={setShowEditModal}
        title="Edit User"
        size="sm"
        showCloseButton={false}
        bodyClassName="pt-6"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-6 py-2 border border-red-500 text-red-500 hover:bg-red-50 font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-user-form"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#1f2937] hover:bg-[#111827] text-white font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Confirm'}
            </button>
          </div>
        }
      >
        {selectedUser && (
          <form onSubmit={handleEditSave} className="space-y-4" id="edit-user-form">

            <div>
              <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Name <span className="text-red-500">*</span></label>
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
              <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Role <span className="text-red-500">*</span></label>
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


          </form>
        )}
      </SideDrawer>

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

      <SideDrawer
        open={showNewRoleModal}
        onOpenChange={setShowNewRoleModal}
        title="New Role"
        size="sm"
        showCloseButton={false}
        bodyClassName="pt-6"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setShowNewRoleModal(false)}
              className="px-6 py-2 border border-red-500 text-red-500 hover:bg-red-50 font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="new-role-form"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#1f2937] hover:bg-[#111827] text-white font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Confirm'}
            </button>
          </div>
        }
      >

        <form onSubmit={handleCreateRole} className="space-y-4" id="new-role-form">

          <div>
            <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Role Name <span className="text-red-500">*</span></label>
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

        </form>

      </SideDrawer>

      {/* Edit Role Modal */}

      <SideDrawer
        open={showEditRoleModal}
        onOpenChange={setShowEditRoleModal}
        title="Edit Role"
        size="sm"
        showCloseButton={false}
        bodyClassName="pt-6"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setShowEditRoleModal(false)}
              className="px-6 py-2 border border-red-500 text-red-500 hover:bg-red-50 font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-role-form"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#1f2937] hover:bg-[#111827] text-white font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        }
      >

        <form onSubmit={handleEditRoleSave} className="space-y-4" id="edit-role-form">

          <div>
            <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Role Name <span className="text-red-500">*</span></label>
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

        </form>

      </SideDrawer>

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
