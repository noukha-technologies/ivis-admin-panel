import React, { useState, useEffect, useMemo } from 'react';
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
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';

import { cn } from '../../utils/cn';
import { useRef } from 'react';

function CustomSelect({ label, options, value, onChange }: {
  label: string;
  options: { label: string, value: string }[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-white border border-slate-200 text-[#101828] text-sm font-semibold rounded-lg px-3.5 py-2.5 hover:bg-neutral-50 transition-all shadow-sm cursor-pointer"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : label}</span>
        <svg className="w-4.5 h-4.5 ml-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-full bg-white border border-neutral-200 rounded-lg shadow-lg py-1.5 z-50 animate-fadeInMenu text-left max-h-60 overflow-y-auto">
          {options.map(opt => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between w-full px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors text-left first:rounded-t-lg last:rounded-b-lg",
                  isSelected ? "bg-neutral-100 text-[#101828]" : "text-[#344054] hover:bg-neutral-50"
                )}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <svg className="w-4 h-4 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface PermissionModuleRow {
  name: string;
  createKey: string;
  editKey: string;
  viewKey: string;
}

const PERMISSION_GRID_MODULES: PermissionModuleRow[] = [
  { name: 'Job Management', createKey: 'JOBS_CREATE', editKey: 'JOBS_UPSERT', viewKey: 'JOBS_VIEW' },
  { name: 'Vehicle & Customer', createKey: 'CUSTOMERS_CREATE', editKey: 'CUSTOMERS_UPSERT', viewKey: 'CUSTOMERS_VIEW' },
  { name: 'Appointments', createKey: 'APPOINTMENTS_CREATE', editKey: 'APPOINTMENTS_UPSERT', viewKey: 'APPOINTMENTS_VIEW' },
  { name: 'Payments', createKey: 'PAYMENTS_CREATE', editKey: 'PAYMENTS_UPSERT', viewKey: 'PAYMENTS_VIEW' },
  { name: 'Vehicle Records', createKey: 'VEHICLE_RECORDS_CREATE', editKey: 'VEHICLE_RECORDS_UPSERT', viewKey: 'VEHICLE_RECORDS_VIEW' },
  { name: 'File Processing', createKey: '', editKey: '', viewKey: 'FILE_PROCESSING_VIEW' },
  { name: 'ROP Integration', createKey: 'ROP_CREATE', editKey: 'ROP_UPSERT', viewKey: 'ROP_VIEW' },
  { name: 'User & Roles', createKey: 'USER_CREATE', editKey: 'USER_EDIT', viewKey: 'USER_VIEW' },
  { name: 'Reports & Analytics', createKey: '', editKey: '', viewKey: 'REPORTS_VIEW' }
];

const ACCESS_MODULE_MAP = [
  { name: 'Job Management', permissions: ['JOBS_VIEW', 'JOBS_CREATE', 'JOBS_UPSERT', 'JOBS_DELETE'] },
  { name: 'Vehicle & Customer', permissions: ['CUSTOMERS_VIEW', 'CUSTOMERS_CREATE', 'CUSTOMERS_UPSERT', 'CUSTOMERS_DELETE'] },
  { name: 'Appointments', permissions: ['APPOINTMENTS_VIEW', 'APPOINTMENTS_CREATE', 'APPOINTMENTS_UPSERT', 'APPOINTMENTS_DELETE'] },
  { name: 'Payments', permissions: ['PAYMENTS_VIEW', 'PAYMENTS_CREATE', 'PAYMENTS_UPSERT', 'PAYMENTS_DELETE'] },
  { name: 'Vehicle Records', permissions: ['VEHICLE_RECORDS_VIEW', 'VEHICLE_RECORDS_CREATE', 'VEHICLE_RECORDS_UPSERT', 'VEHICLE_RECORDS_DELETE'] },
  { name: 'File Processing', permissions: ['FILE_PROCESSING_VIEW'] },
  { name: 'ROP Integration', permissions: ['ROP_VIEW', 'ROP_CREATE', 'ROP_UPSERT', 'ROP_DELETE'] },
  { name: 'User & Roles', permissions: ['USER_VIEW', 'USER_CREATE', 'USER_EDIT', 'USER_DELETE', 'ROLES_VIEW', 'ROLES_CREATE', 'ROLES_UPSERT', 'ROLES_DELETE', 'PERMISSIONS_VIEW', 'PERMISSIONS_CREATE', 'PERMISSIONS_UPSERT', 'PERMISSIONS_DELETE'] },
  { name: 'Reports & Analytics', permissions: ['REPORTS_VIEW'] },
  { name: 'ANPR', permissions: ['ANPR_VIEW', 'ANPR_CREATE', 'ANPR_UPSERT', 'ANPR_DELETE'] },
  { name: 'Configuration', permissions: ['CONFIGURATION_VIEW'] },
  { name: 'Dashboard', permissions: ['DASHBOARD_VIEW'] },
  { name: 'Master Management', permissions: ['MASTERS_VIEW', 'MASTERS_CREATE', 'MASTERS_UPSERT', 'MASTERS_DELETE'] }
];

export function getAccessModulesForPermissions(permissions: string[]): string[] {
  const modules: string[] = [];
  for (const item of ACCESS_MODULE_MAP) {
    if (item.permissions.some(p => permissions?.includes(p))) {
      modules.push(item.name);
    }
  }
  return modules;
}

interface PermissionsGridProps {
  selectedPermissions: string[];
  onChange?: (permissions: string[]) => void;
  disabled?: boolean;
}

const PermissionsGrid: React.FC<PermissionsGridProps> = ({
  selectedPermissions,
  onChange,
  disabled = false,
}) => {
  const togglePermission = (key: string) => {
    if (disabled || !onChange || !key) return;
    const isChecked = selectedPermissions.includes(key);
    const updated = isChecked
      ? selectedPermissions.filter((p) => p !== key)
      : [...selectedPermissions, key];
    onChange(updated);
  };

  return (
    <div className="w-full mt-4 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[13px]">
            <th className="py-3 px-4 text-left font-bold text-slate-600">Module</th>
            <th className="py-3 px-4 text-center font-bold text-slate-600 w-24">Create</th>
            <th className="py-3 px-4 text-center font-bold text-slate-600 w-24">Edit</th>
            <th className="py-3 px-4 text-center font-bold text-slate-600 w-24">View</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {PERMISSION_GRID_MODULES.map((row) => (
            <tr key={row.name} className="hover:bg-slate-50/50 transition-colors text-[13.5px] text-slate-700">
              <td className="py-3 px-4 font-semibold text-slate-800">{row.name}</td>
              <td className="py-3 px-4 text-center">
                {row.createKey && (
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(row.createKey)}
                    onChange={() => togglePermission(row.createKey)}
                    disabled={disabled}
                    className="w-4 h-4 text-[#101828] border-slate-300 rounded focus:ring-[#101828] transition-all cursor-pointer disabled:opacity-50"
                  />
                )}
              </td>
              <td className="py-3 px-4 text-center">
                {row.editKey && (
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(row.editKey)}
                    onChange={() => togglePermission(row.editKey)}
                    disabled={disabled}
                    className="w-4 h-4 text-[#101828] border-slate-300 rounded focus:ring-[#101828] transition-all cursor-pointer disabled:opacity-50"
                  />
                )}
              </td>
              <td className="py-3 px-4 text-center">
                {row.viewKey && (
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(row.viewKey)}
                    onChange={() => togglePermission(row.viewKey)}
                    disabled={disabled}
                    className="w-4 h-4 text-[#101828] border-slate-300 rounded focus:ring-[#101828] transition-all cursor-pointer disabled:opacity-50"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export function formatRoleName(name: string): string {
  if (!name) return '';
  return name
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const UsersPage: React.FC = () => {
  const {
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    canManageRoles,
    canDeleteRoles,
  } = usePermissions();
  const usersHook = useUsers();
  const rolesHook = useRoles();
  const location = useLocation();

  const activeTab = location.pathname === ROUTES.USERS_ROLES ? 'roles' : 'users';


  const userColumns: ColumnDef<UserListItem>[] = [
    {
      id: 'userCode',
      header: 'User Code',
      accessorKey: 'userCode',
      cell: ({ value }) => (
        <span className="font-semibold text-[#101828] tracking-wide">{value}</span>
      ),
      enableSorting: true,
      enableHiding: false,
    },
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
            ...(canEditUsers
              ? [
                  {
                    id: 'edit',
                    label: 'Edit User',
                    icon: <Pencil className="w-4 h-4 text-slate-500" />,
                    onClick: () => handleOpenEdit(row),
                  },
                ]
              : []),
            ...(canDeleteUsers
              ? [
                  {
                    id: 'delete',
                    label: 'Delete',
                    icon: <Trash2 className="w-4 h-4 text-rose-500" />,
                    onClick: () => handleDelete(row.id),
                    variant: 'danger' as const,
                  },
                ]
              : [])
          ]}
        />
      )
    }
  ];

  const [roleToView, setRoleToView] = useState<RoleListItem | null>(null);
  const [showViewRoleDrawer, setShowViewRoleDrawer] = useState(false);

  const roleColumns = useMemo<ColumnDef<RoleListItem>[]>(() => [
    {
      id: 'name',
      header: 'Role',
      accessorKey: 'name',
      cell: ({ value }) => (
        <span className="font-bold text-[#101828]">{formatRoleName(value)}</span>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: 'access',
      header: 'Access',
      cell: ({ row: role }) => {
        const modules = getAccessModulesForPermissions(role.permissions || []);
        const visibleModules = modules.slice(0, 5);
        const remainingCount = modules.length - 5;
        return (
          <div className="flex flex-wrap gap-1.5 items-center w-full">
            {visibleModules.map((m) => (
              <span key={m} className="inline-flex items-center px-2 py-0.5 rounded-lg text-[12px] font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200/80">
                {m}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[12px] font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200/80">
                +{remainingCount}
              </span>
            )}
            {modules.length === 0 && (
              <span className="text-slate-400 font-normal italic text-[13px]">No access modules</span>
            )}
          </div>
        );
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: () => (
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[13.5px] font-medium text-neutral-700">Active</span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row: role }) => (
        <RowActions
          actions={[
            {
              id: 'view',
              label: 'View Details',
              icon: <Eye className="w-4 h-4 text-slate-500" />,
              onClick: () => {
                setRoleToView(role);
                setShowViewRoleDrawer(true);
              }
            },
            ...(canManageRoles
              ? [
                  {
                    id: 'edit',
                    label: 'Edit Role',
                    icon: <Pencil className="w-4 h-4 text-slate-500" />,
                    onClick: () => {
                      setRoleToEdit(role);
                      setRoleFormData({
                        role_name: role.name,
                        permissions: role.permissions,
                      });
                      setFormError(null);
                      setShowEditRoleModal(true);
                    },
                  },
                ]
              : []),
            ...(canDeleteRoles
              ? [
                  {
                    id: 'delete',
                    label: 'Delete',
                    icon: <Trash2 className="w-4 h-4 text-rose-500" />,
                    onClick: () => {
                      setRoleToDelete(role.id);
                      setShowDeleteRoleModal(true);
                    },
                    variant: 'danger' as const,
                  },
                ]
              : [])
          ]}
        />
      )
    }
  ], [canManageRoles, canDeleteRoles]);

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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


  const handleOpenAdd = () => {
    setFormData(emptyUserForm());
    setFormError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowNewModal(true);
  };

  const handleOpenEdit = (user: UserListItem) => {
    setSelectedUser(user);
    setFormData(userFormFromListItem(user));
    setFormError(null);
    setShowEditModal(true);
  };

  const handleOpenView = (user: UserListItem) => {
    setSelectedUser(user);
    setShowViewModal(true);
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
    if (!formData.user_code.trim()) {
      setFormError('User code is required');
      return;
    }
    const code = formData.user_code.trim().toUpperCase();
    if (!/^[A-Za-z0-9]+$/.test(code)) {
      setFormError('User code must contain only letters and numbers');
      return;
    }

    const selectedRole = rolesHook.roles.find((r) => r.name === formData.role);
    if (!selectedRole?.id) {
      setFormError('Please select a valid role');
      return;
    }

    const ok = await usersHook.createUser(formData, selectedRole.id);
    if (ok) setShowNewModal(false);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormError(null);

    if (!formData.user_code.trim()) {
      setFormError('User code is required');
      return;
    }
    const code = formData.user_code.trim().toUpperCase();
    if (!/^[A-Za-z0-9]+$/.test(code)) {
      setFormError('User code must contain only letters and numbers');
      return;
    }

    const selectedRole = rolesHook.roles.find((r) => r.name === formData.role);
    const roleAccessId = selectedRole?.id;

    const ok = await usersHook.updateUser(selectedUser.id, formData, roleAccessId);
    if (ok) {
      setShowEditModal(false);
      setSelectedUser(null);
    }
  };

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
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
    canManageRoles && (
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
          searchPlaceholder="Search by"
          animatedSearchHints={['Role Name', 'Access']}
          rightElement={primaryActionButton}
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
            <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">
              User Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.user_code}
              onChange={(e) =>
                setFormData({ ...formData, user_code: e.target.value.replace(/[^A-Za-z0-9]/g, '') })
              }
              placeholder="e.g. USR1001"
              maxLength={32}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 placeholder:text-slate-400 text-slate-800 uppercase"
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
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 8 characters"
                className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 placeholder:text-slate-400 text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
              >
                {showPassword ? (
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Role <span className="text-red-500">*</span></label>
            {rolesHook.roleOptions.length > 0 ? (
              <CustomSelect
                label="Select role"
                value={formData.role}
                onChange={(val) => setFormData({ ...formData, role: val })}
                options={rolesHook.roleOptions.map((r) => ({ label: r, value: r }))}
              />
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
            <CustomSelect
              label="Select (optional)"
              value={formData.centre}
              onChange={(val) => setFormData({ ...formData, centre: val })}
              options={[
                { label: 'Select (optional)', value: '' },
                ...centreOptions.map((c) => ({ label: c.name, value: c.id }))
              ]}
            />
          </div>

          <div>
            <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Line</label>
            <CustomSelect
              label="Select (optional)"
              value={formData.line}
              onChange={(val) => setFormData({ ...formData, line: val })}
              options={[
                { label: 'Select (optional)', value: '' },
                ...lineOptions.map((l) => ({ label: l.name, value: l.id }))
              ]}
            />
          </div>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          {/* Spacer to allow absolute dropdown menus to scroll and render fully */}
          <div className="h-44" />
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
              <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">User Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={formData.user_code}
                onChange={(e) =>
                  setFormData({ ...formData, user_code: e.target.value.replace(/[^A-Za-z0-9]/g, '') })
                }
                maxLength={32}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 text-slate-800 uppercase"
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
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Role <span className="text-red-500">*</span></label>
              {rolesHook.roleOptions.length > 0 ? (
                <CustomSelect
                  label="Select role"
                  value={formData.role}
                  onChange={(val) => setFormData({ ...formData, role: val })}
                  options={rolesHook.roleOptions.map((r) => ({ label: r, value: r }))}
                />
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
              <CustomSelect
                label="Select (optional)"
                value={formData.centre}
                onChange={(val) => setFormData({ ...formData, centre: val })}
                options={[
                  { label: 'Select (optional)', value: '' },
                  ...centreOptions.map((c) => ({ label: c.name, value: c.id }))
                ]}
              />
            </div>

            <div>
              <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Line</label>
              <CustomSelect
                label="Select (optional)"
                value={formData.line}
                onChange={(val) => setFormData({ ...formData, line: val })}
                options={[
                  { label: 'Select (optional)', value: '' },
                  ...lineOptions.map((l) => ({ label: l.name, value: l.id }))
                ]}
              />
            </div>

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            {/* Spacer to allow absolute dropdown menus to scroll and render fully */}
            <div className="h-44" />
          </form>
        )}
      </SideDrawer>

      {/* Delete User Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this User? This action cannot be undone."
        isSubmitting={isSubmitting}
      />

      {/* New Role Drawer */}
      <SideDrawer
        open={showNewRoleModal}
        onOpenChange={setShowNewRoleModal}
        title="New Role"
        size="md"
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
              className="px-6 py-2 bg-[#101828] hover:bg-neutral-800 text-white font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Confirm'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateRole} className="space-y-4 text-slate-800" id="new-role-form">
          <div>
            <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={roleFormData.role_name}
              onChange={(e) => setRoleFormData({ ...roleFormData, role_name: e.target.value })}
              placeholder="Enter"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 placeholder:text-slate-400 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-[13.5px] font-semibold text-[#334155] mb-1">Select Permission</label>
            <PermissionsGrid
              selectedPermissions={roleFormData.permissions}
              onChange={(perms) => setRoleFormData({ ...roleFormData, permissions: perms })}
            />
          </div>
          {formError && <p className="text-sm text-red-600">{formError}</p>}
        </form>
      </SideDrawer>

      {/* Edit Role Drawer */}
      <SideDrawer
        open={showEditRoleModal}
        onOpenChange={setShowEditRoleModal}
        title="Edit Role"
        size="md"
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
              className="px-6 py-2 bg-[#101828] hover:bg-neutral-800 text-white font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleEditRoleSave} className="space-y-4 text-slate-800" id="edit-role-form">
          <div>
            <label className="block text-[13.5px] font-semibold text-[#334155] mb-1.5">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={roleFormData.role_name}
              onChange={(e) => setRoleFormData({ ...roleFormData, role_name: e.target.value })}
              placeholder="Enter"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:border-slate-400 placeholder:text-slate-400 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-[13.5px] font-semibold text-[#334155] mb-1">Select Permission</label>
            <PermissionsGrid
              selectedPermissions={roleFormData.permissions}
              onChange={(perms) => setRoleFormData({ ...roleFormData, permissions: perms })}
            />
          </div>
          {formError && <p className="text-sm text-red-600">{formError}</p>}
        </form>
      </SideDrawer>

      {/* Delete Role Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteRoleModal}
        onClose={() => {
          setShowDeleteRoleModal(false);
          setRoleToDelete(null);
        }}
        onConfirm={confirmDeleteRole}
        title="Delete Role"
        message="Are you sure you want to delete this Role? This action cannot be undone."
        isSubmitting={isSubmitting}
      />

      {/* View Role Drawer */}
      <SideDrawer
        open={showViewRoleDrawer && !!roleToView}
        onOpenChange={setShowViewRoleDrawer}
        title="View Role Details"
        size="md"
        showCloseButton={false}
        bodyClassName="pt-6"
        footer={
          <div className="flex items-center justify-end w-full">
            <button
              onClick={() => setShowViewRoleDrawer(false)}
              className="px-6 py-2 bg-[#1f2937] hover:bg-[#111827] text-white font-semibold text-[13.5px] rounded-lg transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        }
      >
        {roleToView && (
          <div className="space-y-6 text-slate-800">
            <div>
              <span className="block text-[12px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Role Name</span>
              <span className="text-[16px] font-bold text-neutral-800">{roleToView.name}</span>
            </div>
            <div>
              <span className="block text-[12px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Permissions</span>
              <PermissionsGrid
                selectedPermissions={roleToView.permissions}
                disabled={true}
              />
            </div>
          </div>
        )}
      </SideDrawer>

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-120 p-6 shadow-2xl border border-neutral-100">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-[18px] font-bold text-gray-900">{selectedUser.name}</h3>
                <p className="text-[12px] text-gray-500 mt-0.5">{selectedUser.userCode}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-gray-500 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="block text-[12px] font-bold text-neutral-400 uppercase tracking-wider">User Code</span>
                <span className="text-[15px] font-medium text-neutral-800">{selectedUser.userCode}</span>
              </div>
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
