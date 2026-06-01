/**
 * Mirrors IVIS-Backend `common/auth/role-permissions.ts` module map.
 * Keeps admin role UI aligned with `core.role_access.access` JSON.
 */
export const ROLE_ACCESS_MODULES = [
  'job_management',
  'vehicle_customer',
  'appointments',
  'payments',
  'vehicle_records',
  'file_processing',
  'rop_integration',
  'user_roles',
  'reports_analytics',
] as const;

export type RoleAccessModule = (typeof ROLE_ACCESS_MODULES)[number];

export type ModuleCrudFlags = {
  create: boolean;
  edit: boolean;
  view: boolean;
};

export type RoleAccessMatrix = Record<RoleAccessModule, ModuleCrudFlags>;

type ModulePermissionMap = {
  create: string[];
  edit: string[];
  view: string[];
};

export const MODULE_PERMISSION_MAP: Record<RoleAccessModule, ModulePermissionMap> = {
  job_management: {
    view: ['JOBS_VIEW'],
    create: ['JOBS_CREATE'],
    edit: ['JOBS_UPSERT', 'JOBS_DELETE'],
  },
  vehicle_customer: {
    view: ['CUSTOMERS_VIEW', 'ANPR_VIEW'],
    create: ['CUSTOMERS_CREATE', 'ANPR_CREATE'],
    edit: [
      'CUSTOMERS_UPSERT',
      'CUSTOMERS_DELETE',
      'ANPR_UPSERT',
      'ANPR_DELETE',
    ],
  },
  appointments: {
    view: ['APPOINTMENTS_VIEW'],
    create: ['APPOINTMENTS_CREATE'],
    edit: ['APPOINTMENTS_UPSERT', 'APPOINTMENTS_DELETE'],
  },
  payments: {
    view: ['PAYMENTS_VIEW'],
    create: ['PAYMENTS_CREATE'],
    edit: ['PAYMENTS_UPSERT', 'PAYMENTS_DELETE'],
  },
  vehicle_records: {
    view: ['VEHICLE_RECORDS_VIEW'],
    create: ['VEHICLE_RECORDS_CREATE'],
    edit: ['VEHICLE_RECORDS_UPSERT', 'VEHICLE_RECORDS_DELETE'],
  },
  file_processing: {
    view: ['FILE_PROCESSING_VIEW'],
    create: [],
    edit: [],
  },
  rop_integration: {
    view: ['ROP_VIEW'],
    create: ['ROP_CREATE'],
    edit: ['ROP_UPSERT', 'ROP_DELETE'],
  },
  user_roles: {
    view: ['USER_VIEW', 'ROLES_VIEW', 'PERMISSIONS_VIEW', 'MASTERS_VIEW'],
    create: ['USER_CREATE', 'ROLES_CREATE', 'PERMISSIONS_CREATE', 'MASTERS_CREATE'],
    edit: [
      'USER_EDIT',
      'USER_DELETE',
      'ROLES_UPSERT',
      'ROLES_DELETE',
      'PERMISSIONS_UPSERT',
      'PERMISSIONS_DELETE',
      'MASTERS_UPSERT',
      'MASTERS_DELETE',
    ],
  },
  reports_analytics: {
    view: ['DASHBOARD_VIEW', 'REPORTS_VIEW', 'CONFIGURATION_VIEW'],
    create: [],
    edit: [],
  },
};

export function createEmptyRoleAccessMatrix(): RoleAccessMatrix {
  return ROLE_ACCESS_MODULES.reduce((acc, module) => {
    acc[module] = { create: false, edit: false, view: false };
    return acc;
  }, {} as RoleAccessMatrix);
}

function hasAnyKey(keySet: Set<string>, keys: string[]): boolean {
  return keys.some((key) => keySet.has(key));
}

export function matrixFromFlatPermissions(flatKeys: string[]): RoleAccessMatrix {
  const keySet = new Set(flatKeys);
  const matrix = createEmptyRoleAccessMatrix();

  for (const module of ROLE_ACCESS_MODULES) {
    const map = MODULE_PERMISSION_MAP[module];
    matrix[module] = {
      view: hasAnyKey(keySet, map.view),
      create: hasAnyKey(keySet, map.create),
      edit: hasAnyKey(keySet, map.edit),
    };
  }

  return matrix;
}

export function resolveFlatPermissionsFromMatrix(matrix: RoleAccessMatrix): string[] {
  const resolved = new Set<string>();

  for (const module of ROLE_ACCESS_MODULES) {
    const flags = matrix[module];
    const map = MODULE_PERMISSION_MAP[module];

    if (flags.view) {
      map.view.forEach((key) => resolved.add(key));
    }
    if (flags.create) {
      map.create.forEach((key) => resolved.add(key));
    }
    if (flags.edit) {
      map.edit.forEach((key) => resolved.add(key));
    }
  }

  return [...resolved];
}
