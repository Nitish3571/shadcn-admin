import API from '@/config/api/api'
import usePostData from '@/hooks/usePostData'

interface ForgotPasswordData {
  email: string
}

export const useForgotPassword = (options?: any) => {
  return usePostData({
    url: API.auth.forgotPassword,
    mutationOptions: options,
  })
}
