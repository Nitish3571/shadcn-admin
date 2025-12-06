import API from '@/config/api/api'
import usePostData from '@/hooks/usePostData'

interface ChangePasswordData {
  current_password: string
  password: string
  password_confirmation: string
}

export const useChangePassword = (options?: any) => {
  return usePostData({
    url: API.auth.changePassword,
    mutationOptions: options,
  })
}
