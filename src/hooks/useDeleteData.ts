
import instance from '@/config/instance/instance';
import {
  UseMutationOptions,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { toast } from 'sonner';

interface DeleteDataOptions<TData, TVariables = void> {
  url: string | ((variables: TVariables) => string);
  refetchQueries?: string[];
  mutationOptions?: UseMutationOptions<TData, Error, TVariables>;
}

const useDeleteData = <TData = unknown, TVariables = void>({
  url,
  refetchQueries = [],
  mutationOptions
}: DeleteDataOptions<TData, TVariables>) => {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables): Promise<TData> => {
      const deleteUrl = typeof url === 'function' ? url(variables) : url;
      const response = await instance.delete({ url: deleteUrl });

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