import API from '@/config/api/api'
import useFetchData from '@/hooks/useFetchData'

export const useGetUsers = () => {
  return useFetchData({ url: API.users.list })
}
