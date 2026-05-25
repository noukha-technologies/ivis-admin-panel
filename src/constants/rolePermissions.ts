import { PERMISSIONS, type Permission } from './permissions';

const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);

const ROLE_PERMISSION_MAP: Record<string, Permission[]> = {
  admin: ALL_PERMISSIONS,
  system_admin: ALL_PERMISSIONS,
  client_admin: ALL_PERMISSIONS,
};

/**
 * Mirrors IVIS-Backend resolvePermissionsForRole
 */
export function resolvePermissionsForRole(role: string): Permission[] {
  const normalized = role.trim().toLowerCase();
  return ROLE_PERMISSION_MAP[normalized] ?? [PERMISSIONS.USER_VIEW];
}
