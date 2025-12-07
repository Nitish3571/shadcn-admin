import { AxiosError } from 'axios';
import { toast } from 'sonner';
import i18n from '@/i18n';

interface ApiErrorResponse {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

/**
 * Centralized error handler for API requests
 * Provides consistent error messaging across the application
 */
export function handleApiError(error: unknown): string {
  // Log error in development
  if (import.meta.env.DEV) {
    console.error('API Error:', error);
  }

  let errorMessage = i18n.t('something_went_wrong_try_again');

  // Handle Axios errors
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse;
    
    // Use custom error message from API
    if (response?.message) {
      errorMessage = response.message;
    } else if (response?.title) {
      errorMessage = response.title;
    }
    
    // Handle validation errors
    if (response?.errors) {
      const firstError = Object.values(response.errors)[0];
      if (firstError && firstError.length > 0) {
        errorMessage = firstError[0];
      }
    }
    
    // Handle specific status codes
    switch (error.response?.status) {
      case 401:
        errorMessage = i18n.t('unauthorized_login_again');
        break;
      case 403:
        errorMessage = i18n.t('no_permission_action');
        break;
      case 404:
        errorMessage = i18n.t('resource_not_found');
        break;
      case 422:
        errorMessage = response?.message || i18n.t('validation_failed_check_input');
        break;
      case 500:
        errorMessage = i18n.t('server_error_try_later');
        break;
      case 503:
        errorMessage = i18n.t('service_unavailable_try_later');
        break;
    }
  }
  
  // Handle network errors
  if (error instanceof Error) {
    if (error.message === 'Network Error') {
      errorMessage = i18n.t('network_error_check_connection');
    } else if (!error.message.includes('API')) {
      errorMessage = error.message;
    }
  }

  // Show toast notification
  toast.error(errorMessage);
  
  return errorMessage;
}

/**
 * Handle success messages
 */
export function handleApiSuccess(message: string) {
  toast.success(message);
}

/**
 * Handle info messages
 */
export function handleApiInfo(message: string) {
  toast.info(message);
}

/**
 * Handle warning messages
 */
export function handleApiWarning(message: string) {
  toast.warning(message);
}
