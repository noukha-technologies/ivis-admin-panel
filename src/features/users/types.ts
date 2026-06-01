import type { RoleAccessMatrix } from '../../constants/roleAccessMatrix';

export interface UserListItem {
  id: string;
  userId: number;
  userCode: string;
  name: string;
  email: string;
  role: string;
  centre: string;
  centreId: string;
  line: string;
  lineId: string;
  lineIds: string[];
  status: 'Active';
  created: string;
}

export interface RoleListItem {
  id: string;
  name: string;
  created: string;
  permissions: string[];
  access: RoleAccessMatrix;
}

export interface UserFormData {
  user_code: string;
  name: string;
  email: string;
  role: string;
  centre: string;
  line: string;
  password: string;
  confirmPassword: string;
}

export interface RoleFormData {
  role_name: string;
  permissions: string[];
}

export const emptyUserForm = (): UserFormData => ({
  user_code: '',
  name: '',
  email: '',
  role: '',
  centre: '',
  line: '',
  password: '',
  confirmPassword: '',
});

export const emptyRoleForm = (): RoleFormData => ({
  role_name: '',
  permissions: [],
});
