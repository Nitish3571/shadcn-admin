import API from '@/config/api/api'
import usePostData from '@/hooks/usePostData'

interface VerifyEmailData {
  email: string
  token: string
}

interface ResendVerificationData {
  email: string
}

export const useVerifyEmail = (options?: any) => {
  return usePostData({
    url: API.auth.verifyEmail,
    mutationOptions: options,
  })
}

export const useResendVerification = (options?: any) => {
  return usePostData({
    url: API.auth.resendVerification,
    mutationOptions: options,
  })
}
