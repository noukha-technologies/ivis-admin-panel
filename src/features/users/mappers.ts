import type { ApiUser, CreateUserPayload, UpdateUserPayload } from '../../api/services/user.service';
import type { ApiRoleAccess } from '../../api/services/role.service';
import type { UserFormData, UserListItem, RoleListItem, RoleFormData } from './types';
import {
  matrixFromFlatPermissions,
  resolveFlatPermissionsFromMatrix,
} from '../../constants/roleAccessMatrix';
import type { CreateRoleAccessPayload, UpdateRoleAccessPayload } from '../../interfaces/role.interface';

export function toUserListItem(user: ApiUser): UserListItem {
  const created = user.created_at
    ? new Date(user.created_at).toISOString().split('T')[0]
    : '—';
  const roleName = user.roleAccess?.role_name ?? '—';
  const primaryLine = user.lines?.[0];
  const lineNames = user.lines?.map((l) => l.name).filter(Boolean).join(', ') ?? '—';

  return {
    id: user.id,
    userId: user.user_id,
    userCode: user.user_code,
    name: user.user_name,
    email: user.email,
    role: roleName,
    centre: user.assignedCentre?.name ?? '—',
    centreId: user.assignedCentre?.id ?? user.center_id ?? '',
    line: lineNames,
    lineId: primaryLine?.id ?? user.line_ids?.[0] ?? '',
    lineIds: user.line_ids ?? [],
    status: 'Active',
    created,
  };
}

export function toRoleListItem(role: ApiRoleAccess): RoleListItem {
  const created = role.created_at
    ? new Date(role.created_at).toISOString().split('T')[0]
    : '—';
  const permissions = resolveFlatPermissionsFromMatrix(role.access);

  return {
    id: role.id,
    name: role.role_name,
    created,
    permissions,
    access: role.access,
  };
}

export function toCreateRolePayload(form: RoleFormData): CreateRoleAccessPayload {
  return {
    role_name: form.role_name.trim(),
    access: matrixFromFlatPermissions(form.permissions),
  };
}

export function toUpdateRolePayload(form: RoleFormData): UpdateRoleAccessPayload {
  return {
    role_name: form.role_name.trim(),
    access: matrixFromFlatPermissions(form.permissions),
  };
}

export function toCreatePayload(
  form: UserFormData,
  roleAccessId: string,
): CreateUserPayload {
  return {
    user_code: form.user_code.trim().toUpperCase(),
    user_name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    role_access_id: roleAccessId,
    password: form.password,
    center_id: form.centre || undefined,
    line_ids: form.line ? [form.line] : undefined,
  };
}

export function toUpdatePayload(
  form: UserFormData,
  roleAccessId?: string,
): UpdateUserPayload {
  return {
    user_name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    user_code: form.user_code.trim().toUpperCase(),
    ...(roleAccessId ? { role_access_id: roleAccessId } : {}),
    center_id: form.centre || null,
    line_ids: form.line ? [form.line] : [],
  };
}

export function userFormFromListItem(user: UserListItem): UserFormData {
  return {
    user_code: user.userCode,
    name: user.name,
    email: user.email,
    role: user.role,
    centre: user.centreId || '',
    line: user.lineId || user.lineIds[0] || '',
    password: '',
    confirmPassword: '',
  };
}
