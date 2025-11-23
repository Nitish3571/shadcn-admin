export interface Permission {
  id: number;
  name: string;
  module?: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface RoleFormData {
  id?: number;
  name: string;
  permissions: string[];
}

export interface RolesListResponse {
  data: Role[];
  total: number;
  column: any[];
  datatable_column: any[];
}

export interface RoleResponse {
  data: Role;
}
