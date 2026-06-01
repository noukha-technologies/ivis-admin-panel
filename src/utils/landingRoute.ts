import { getPermissions } from './storage';
import {
  getDefaultLandingRoute,
  type NavPermissionEntry,
} from '../constants/navPermissions';
import type { Permission } from '../constants/permissions';

function hasAny(permissions: Permission[], keys: Permission[]): boolean {
  return keys.some((key) => permissions.includes(key));
}

function hasAll(permissions: Permission[], keys: Permission[]): boolean {
  return keys.every((key) => permissions.includes(key));
}

export function resolveLandingRoute(): string {
  const permissions = getPermissions();
  return getDefaultLandingRoute(
    (keys) => hasAny(permissions, keys),
    (keys) => hasAll(permissions, keys),
  );
}

export function canAccessMenu(
  menuName: string,
  menuPermissions: Record<string, NavPermissionEntry>,
  permissions: Permission[],
): boolean {
  const entry = menuPermissions[menuName];
  if (!entry) {
    return true;
  }
  if (entry.match === 'all') {
    return hasAll(permissions, entry.permissions);
  }
  return hasAny(permissions, entry.permissions);
}
