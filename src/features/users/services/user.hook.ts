import API from '@/config/api/api'
import useFetchData from '@/hooks/useFetchData'
import usePostData from '@/hooks/usePostData'

export const useGetUsers = () => {
  return useFetchData({ url: API.users.list })
}
export const usePostUser = () => {
  return usePostData({ url: API.users.list, refetchQueries: ['users'] })
}

export const useGetUsersById = (userId: number) => {
  return useFetchData({ url: `${API.users.list}/${userId}`, enabled: !!userId })
}

export const useUpdateUser = () => {
  return usePostData({ url: API.users.update, refetchQueries: ['users'] })
}