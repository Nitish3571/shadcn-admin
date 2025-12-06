import API from '@/config/api/api'
import usePostData from '@/hooks/usePostData'

interface ResetPasswordData {
  email: string
  token: string
  password: string
  password_confirmation: string
}

export const useResetPassword = (options?: any) => {
  return usePostData({
    url: API.auth.resetPassword,
    mutationOptions: options,
  })
}
