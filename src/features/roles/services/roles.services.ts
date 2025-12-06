import API from '@/config/api/api';
import useDeleteData from '@/hooks/useDeleteData';
import useFetchData from '@/hooks/useFetchData';
import usePostData from '@/hooks/usePostData';
import { useRoleStore } from '../store/role-store';
import { RolesListResponse, RoleResponse } from '../types/role.types';

export const useGetPermissions = () => {
  return useFetchData({
    url: API.permissions.list,
    queryOptions: {
      select: (data: any) => {
        return data?.data || data;
      }
    }
  });
};

export const useGetRoles = (params?: any) => {
  return useFetchData<RolesListResponse>({
    url: API.roles.list,
    params
  });
};

export const useGetRoleById = (roleId: number) => {
  return useFetchData<RoleResponse>({
    url: API.roles.show(roleId),
    enabled: !!roleId
  });
};

export const usePostRole = () => {
  const { setOpen } = useRoleStore();
  return usePostData({
    url: API.roles.store,
    refetchQueries: [API.roles.list],
    mutationOptions: {
      onSuccess: () => {
        setOpen(null);
      }
    }
  });
};

export const useDeleteRole = (ids: string) => {
  const { setOpen } = useRoleStore();
  return useDeleteData({
    url: API.roles.delete(ids),
    refetchQueries: [API.roles.list],
    mutationOptions: {
      onSuccess: () => {
        setOpen(null);
      }
    }
  });
};
