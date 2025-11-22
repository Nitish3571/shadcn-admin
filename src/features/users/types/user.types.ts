export interface Role {
  id: number;
  name: string;
  display_name?: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  display_name?: string;
  description?: string;
  module?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  bio?: string;
  date_of_birth?: string;
  user_type: number;
  status: number;
  avatar_url?: string;
  roles: Role[];
  permissions: Permission[]; // All permissions (from roles + direct)
  created_at?: string;
  updated_at?: string;
}

export interface UserFormData {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
  bio?: string;
  date_of_birth?: string;
  user_type: number;
  status: number;
  roles: string[];
  permissions?: string[]; // Direct permissions only
  avatar?: File;
}

export interface UsersListResponse {
  data: User[];
  total: number;
  column: any[];
  datatable_column: any[];
}

export interface UserResponse {
  data: User;
}
