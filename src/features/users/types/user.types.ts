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
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  gender?: string;
  last_login_at?: string;
  timezone?: string;
  language?: string;
  is_verified?: boolean;
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
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  gender?: string;
  timezone?: string;
  language?: string;
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
