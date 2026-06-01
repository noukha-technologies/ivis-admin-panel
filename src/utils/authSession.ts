import type { Permission } from '../constants/permissions';
import { resolvePermissionsForRole } from '../constants/rolePermissions';
import type { LoginResponse } from '../interfaces/auth.interface';
import { setPermissions, setRefreshToken, setToken, setUser, type StoredAuthUser } from './storage';

export const AUTH_SESSION_UPDATED_EVENT = 'ivis-auth-session-updated';

export function applyAuthSession(data: LoginResponse): void {
  setToken(data.accessToken);
  setRefreshToken(data.refreshToken);
  setUser(data.user as StoredAuthUser);

  const fromApi = data.permissions ?? [];
  const permissions: Permission[] =
    fromApi.length > 0
      ? (fromApi as Permission[])
      : resolvePermissionsForRole(data.user.role);

  setPermissions(permissions);
  window.dispatchEvent(new Event(AUTH_SESSION_UPDATED_EVENT));
}
