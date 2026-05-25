import type { ApiUser, CreateUserPayload, UpdateUserPayload } from '../../api/services/user.service';
import type { ApiRole } from '../../api/services/role.service';
import type { UserFormData, UserListItem, RoleListItem } from './types';

export function toUserListItem(user: ApiUser): UserListItem {
  const created = user.created_at
    ? new Date(user.created_at).toISOString().split('T')[0]
    : '—';
  const roleName =
    user.role && typeof user.role === 'object'
      ? (user.role as any).role_name
      : (user.role || '—');
  return {
    id: user.id,
    userId: user.user_id,
    name: user.user_name,
    email: user.email,
    role: roleName,
    centre: user.center ?? '—',
    line: user.line ?? '—',
    status: 'Active',
    created,
  };
}

export function toRoleListItem(role: ApiRole): RoleListItem {
  const created = role.created_at
    ? new Date(role.created_at).toISOString().split('T')[0]
    : '—';
  return {
    id: role.id,
    role_id: role.role_id,
    name: role.role_name,
    description: role.description ?? '—',
    created,
  };
}

export function toCreatePayload(form: UserFormData, roleId?: number): CreateUserPayload {
  return {
    user_id: parseInt(form.user_id, 10),
    user_name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    role_id: roleId || 0,
    password: form.password,
    center: form.centre || undefined,
    line: form.line || undefined,
  };
}

export function toUpdatePayload(form: UserFormData, roleId?: number): UpdateUserPayload {
  return {
    user_name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    role_id: roleId,
    center: form.centre || undefined,
    line: form.line || undefined,
  };
}

export function userFormFromListItem(user: UserListItem): UserFormData {
  return {
    user_id: String(user.userId),
    name: user.name,
    email: user.email,
    role: user.role,
    centre: user.centre === '—' ? '' : user.centre,
    line: user.line === '—' ? '' : user.line,
    password: '',
    confirmPassword: '',
  };
}
