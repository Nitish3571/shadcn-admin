
import instance from '@/config/instance/instance';
import {
  UseMutationOptions,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { toast } from 'sonner';

interface DeleteDataOptions<TData> {
  url: string;
  refetchQueries?: string[];
  mutationOptions?: UseMutationOptions<TData, Error, void>;
}

const useDeleteData = <TData = unknown>({
  url,
  refetchQueries = [],
  mutationOptions
}: DeleteDataOptions<TData>) => {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, void>({
    mutationFn: async (): Promise<TData> => {
      const response = await instance.delete({ url });

      if (response?.statusCode === 200) {
        return response.data as TData;
      }

      const errorMessage = response?.message || 'Failed to delete data';
      if (response?.statusCode === 400) {
        throw Object.assign(new Error(errorMessage), { statusCode: 400 });
      }
      if (response?.statusCode === 401) {
        throw Object.assign(new Error('Unauthorized'), { statusCode: 401 });
      }

      throw new Error(errorMessage);
    },
    onSuccess: () => {
      refetchQueries.forEach((query) =>
        queryClient.invalidateQueries({ queryKey: [query] })
      );
    },
    onError: (error: Error & { statusCode?: number }) => {
      toast.error(
        error.statusCode === 400
          ? 'Bad Request: ' + error.message
          : error.statusCode === 401
            ? 'Unauthorized: ' + error.message
            : 'Error: ' + error.message
      );
    },
    ...mutationOptions
  });
};

export default useDeleteData;