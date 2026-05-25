export interface UserListItem {
  id: string;
  userId: number;
  name: string;
  email: string;
  role: string;
  centre: string;
  line: string;
  status: 'Active';
  created: string;
}

export interface RoleListItem {
  id: string;
  role_id: number;
  name: string;
  description: string;
  created: string;
}

export interface UserFormData {
  user_id: string;
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
  description: string;
}

export const emptyUserForm = (): UserFormData => ({
  user_id: '',
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
  description: '',
});
