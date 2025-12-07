import API from '@/config/api/api'
import usePostData from '@/hooks/usePostData'

export const useUpdateProfile = (options?: any) => {
  return usePostData({
    url: API.auth.updateProfile,
    mutationOptions: options,
  })
}
