
import instance from '@/config/instance/instance';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient
} from '@tanstack/react-query';
import { toast } from 'sonner';

interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T;
  error?: boolean;
}

interface UsePostDataProps<TData, TVariables> {
  url: string;
  mutationOptions?: UseMutationOptions<TData, Error, TVariables>;
  headers?: Record<string, string>;
  refetchQueries?: string[];
}

const usePostData = <TData = unknown, TVariables = unknown>({
  url,
  mutationOptions,
  headers = {},
  refetchQueries
}: UsePostDataProps<TData, TVariables>) => {
  const queryClient = useQueryClient();


  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await instance.post<ApiResponse<TData>>({
        url,
        data: variables,
        headers
      });
      
      if (response?.statusCode === 200 || response?.statusCode === 201) {
        toast(response?.message || 'Data posted successfully');
        return response.data; // Extracting only the data field
      }

      if (response?.statusCode === 400||response?.statusCode === 422) {
        throw Object.assign(new Error(response?.message || 'Bad Request'), {
          statusCode: response?.statusCode,
          data: response?.data
        });
      }
      throw new Error(response?.message || 'Failed to post data');
    },
    
    onSuccess: () => {
      if (refetchQueries) {
        refetchQueries.forEach((queryKey) => {
          queryClient.refetchQueries({ queryKey: [queryKey] });
        });
      }
    },
    
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'An error occurred while posting data');
    },
    ...mutationOptions
  });
};

export default usePostData;