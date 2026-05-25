/**
 * Backend-privileged roles (full permissions via role-permissions map)
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  SYSTEM_ADMIN: 'system_admin',
  CLIENT_ADMIN: 'client_admin',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const PRIVILEGED_ROLES: string[] = Object.values(USER_ROLES);
