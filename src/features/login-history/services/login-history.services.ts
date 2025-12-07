import API from '@/config/api/api';
import useFetchData from '@/hooks/useFetchData';
import { LoginHistoryListResponse } from '../types/login-history.types';

export const useGetLoginHistory = (params?: any) => {
  console.log('useGetLoginHistory called with:', {
    url: API.loginHistory.list,
    params
  });
  
  return useFetchData<LoginHistoryListResponse>({
    url: API.loginHistory.list,
    params
  });
};

export const useGetLoginHistoryById = (id: number) => {
  return useFetchData({
    url: API.loginHistory.show(id),
    enabled: !!id
  });
};
