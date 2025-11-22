import { useAuthStore } from '@/stores/authStore';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1/',
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  title?: string;
  message?: string;
  data: T;
}

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else if (config.data) {
      config.headers['Content-Type'] = 'application/json;charset=utf-8';
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  <T>(res: AxiosResponse<ApiResponse<T>>) => {
    if (!res.data) throw new Error('Error in response');
    const { statusCode } = res.data;
    const hasSuccess = statusCode === 200 || statusCode === 201;
    if (hasSuccess) {
      return res;
    }
    throw new Error(res.data.message || 'Unknown API error');
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      Cookies.remove('token');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

class Instance {
  get<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>({ ...config, method: 'GET' });
  }

  post<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>({ ...config, method: 'POST' });
  }

  put<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>({ ...config, method: 'PUT' });
  }

  patch<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>({ ...config, method: 'PATCH' });
  }

  delete<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>({ ...config, method: 'DELETE' });
  }

  request<T>(config: AxiosRequestConfig): Promise<T> {
    return axiosInstance.request<T>(config).then((res) => res.data);
  }
}

export default new Instance();
