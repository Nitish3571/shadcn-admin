import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { create } from 'zustand';
import type { UserWithPermissions, Permission, Role } from '../types/permission';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: null;
  user_type: number;
  phone: null;
  date_of_birth: null;
  bio: null;
  status: number;
  created_by: null | string;
  updated_by: null | string;
  deleted_by: null | string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
  roles?: Role[];
  permissions?: Permission[];
}

type AuthState = {
  userInfo: User | null;
  token: string | null;
  setUserInfo: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  refreshUserInfo: () => Promise<void>;
  hasPermission: (permission: string | string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasRole: (role: string | string[]) => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userInfo: null,
      token: Cookies.get('token') || null,
      
      setUserInfo: (user) => set({ userInfo: user }),
      
      setToken: (token) => {
        Cookies.set('token', token, { expires: 7, sameSite: 'strict' });
        set({ token });
      },
      
      logout: () => {
        Cookies.remove('token');
        localStorage.removeItem('auth-storage');
        set({ userInfo: null, token: null });
      },
      
      // Refresh user info from server (to get updated permissions)
      refreshUserInfo: async () => {
        const { token } = get();
        if (!token) return;
        
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'}/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            set({ userInfo: data.data || data });
          }
        } catch (error) {
          console.error('Failed to refresh user info:', error);
        }
      },
      
      // Check if user has permission(s) - OR logic for arrays
      hasPermission: (permission) => {
        const { userInfo } = get();
        if (!userInfo?.permissions) return false;
        
        const userPermissions = userInfo.permissions.map((p) => p.name);
        
        if (Array.isArray(permission)) {
          return permission.some((p) => userPermissions.includes(p));
        }
        
        return userPermissions.includes(permission);
      },
      
      // Check if user has ALL permissions - AND logic
      hasAllPermissions: (permissions) => {
        const { userInfo } = get();
        if (!userInfo?.permissions) return false;
        
        const userPermissions = userInfo.permissions.map((p) => p.name);
        return permissions.every((p) => userPermissions.includes(p));
      },
      
      // Check if user has role(s) - OR logic for arrays
      hasRole: (role) => {
        const { userInfo } = get();
        if (!userInfo?.roles) return false;
        
        const userRoles = userInfo.roles.map((r) => r.name);
        
        if (Array.isArray(role)) {
          return role.some((r) => userRoles.includes(r));
        }
        
        return userRoles.includes(role);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ userInfo: state.userInfo }),
    }
  )
);
