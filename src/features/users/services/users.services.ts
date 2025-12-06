import API from '@/config/api/api';
import useDeleteData from '@/hooks/useDeleteData';
import useFetchData from '@/hooks/useFetchData';
import usePostData from '@/hooks/usePostData';
import { useUserStore } from '../store/user-store';
import { UsersListResponse, UserResponse } from '../types/user.types';

export const useGetRoles = () => {
  return useFetchData({ 
    url: API.roles.all,
    queryOptions: {
      select: (data: any) => {
        return data?.data || data;
      }
    }
  });
};

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

export const useGetUsers = (params?: any) => {
  return useFetchData<UsersListResponse>({
    url: API.users.list,
    params
  });
};

export const useGetUserById = (userId: number) => {
  return useFetchData<UserResponse>({
    url: API.users.show(userId),
    enabled: !!userId
  });
};

export const usePostUser = () => {
  const { setOpen } = useUserStore();
  return usePostData({
    url: API.users.store,
    refetchQueries: [API.users.list],
    mutationOptions: {
      onSuccess: () => {
        setOpen(null);
      }
    }
  });
};

export const useDeleteUser = () => {
  const { setOpen } = useUserStore();
  return useDeleteData({
    url: API.users.list,
    refetchQueries: [API.users.list],
    mutationOptions: {
      onSuccess: () => {
        setOpen(null);
      }
    }
  });
};
