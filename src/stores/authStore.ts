import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie'
import { create } from 'zustand'

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: null
  user_type: number
  phone: null
  date_of_birth: null
  bio: null
  status: number
  created_by: null | string
  updated_by: null | string
  deleted_by: null | string
  created_at: Date
  updated_at: Date
  deleted_at: null
}

type AuthState = {
  userInfo: User | null
  token: string | null
  setUserInfo: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ userInfo: state.userInfo }),
    }
  )
);
