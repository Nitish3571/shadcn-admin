import API from '@/config/api/api';
import useDeleteData from '@/hooks/useDeleteData';
import useFetchData from '@/hooks/useFetchData';
import { useActivityLogStore } from '../store/activity-log-store';
import { ActivityLogListResponse, ActivityLogResponse, ActivityLogStats } from '../types/activity-log.types';

export const useGetActivityLogs = (params?: any) => {
  return useFetchData<ActivityLogListResponse>({
    url: API.activityLogs.list,
    params
  });
};

export const useGetActivityLogById = (logId: number) => {
  return useFetchData<ActivityLogResponse>({
    url: API.activityLogs.show(logId),
    enabled: !!logId
  });
};

export const useGetActivityLogStats = () => {
  return useFetchData<ActivityLogStats>({
    url: API.activityLogs.stats,
  });
};

export const useDeleteActivityLog = () => {
  const { setOpen } = useActivityLogStore();
  return useDeleteData({
    url: (ids: string) => API.activityLogs.delete(ids),
    refetchQueries: [API.activityLogs.list],
    mutationOptions: {
      onSuccess: () => {
        setOpen(null);
      }
    }
  });
};
