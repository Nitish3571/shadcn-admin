import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('superadmin'),
  z.literal('admin'),
  z.literal('cashier'),
  z.literal('manager'),
])

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  status: z.string(),
  role: z.string(),
  bio: z.string().nullable(), 
  user_type: z.number(),
  date_of_birth: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)

export interface UserListResponse {
  data: UserListResponseTypes[];

}


export interface UserListResponseTypes {
  id:                number;
  name:              string;
  email:             string;
  email_verified_at: null;
  user_type:         number;
  phone:             null;
  date_of_birth:     null;
  bio:               null;
  status:            number;
  created_by:        null;
  updated_by:        null;
  deleted_by:        null;
  created_at:        Date;
  updated_at:        Date;
  deleted_at:        null;
  roles:             Role[];
  permissions:       Permission[];
  
}

export interface Permission {
  id:          number;
  name:        string;
  guard_name:  string;
  module_id:   string;
  description: string;
  created_at:  Date;
  updated_at:  Date;
  pivot:       PermissionPivot;
}

export interface PermissionPivot {
  model_type:    string;
  model_id:      number;
  permission_id: number;
}

export interface Role {
  id:         number;
  name:       string;
  guard_name: string;
  created_at: Date;
  updated_at: Date;
  pivot:      RolePivot;
}

export interface RolePivot {
  model_type: string;
  model_id:   number;
  role_id:    number;
}

