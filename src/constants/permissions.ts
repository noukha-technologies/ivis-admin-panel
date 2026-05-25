/**
 * Permission constants — aligned with IVIS-Backend PermissionKeys
 */
export const PERMISSIONS = {
  USER_VIEW: 'USER_VIEW',
  USER_CREATE: 'USER_CREATE',
  USER_EDIT: 'USER_EDIT',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
