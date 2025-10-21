import API from '@/config/api/api'
import useDeleteData from '@/hooks/useDeleteData'
import useFetchData from '@/hooks/useFetchData'
import usePostData from '@/hooks/usePostData'
export const useGetRole = () => {
  return useFetchData({ url: API.roles.list })
}
export const usePostRole = () => {
  return usePostData({ url: API.roles.list, refetchQueries: ['roles'] })
}

export const useGetRolesById = (roleId: number) => {
  return useFetchData({ url: `${API.roles.list}/${roleId}`, enabled: !!roleId })
}

export const useDeleteRole = (roleId: number) => {
  console.log("hooks role", roleId);
  return useDeleteData({ url: `${API.roles.list}/${roleId}`, refetchQueries: ['roles'] })
}

export const useGetAllModulePermissions = () => {
  return useFetchData({ url: `${API.roles.modulePermissions}`, enabled: true })
}