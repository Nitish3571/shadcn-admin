import API from '@/config/api/api'
import usePostData from '@/hooks/usePostData'
import { useAuthStore, User } from '@/stores/authStore'
import { useNavigate } from '@tanstack/react-router'

interface RegisterData {
  user: User
  token: string
}

export const useRegister = (options?: any) => {
  return usePostData({
    url: API.auth.register,
    mutationOptions: options,
  })
}