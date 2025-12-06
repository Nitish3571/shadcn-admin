import { AxiosError } from 'axios';
import { toast } from 'sonner';

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

  let errorMessage = 'Something went wrong. Please try again.';

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
        errorMessage = 'Unauthorized. Please login again.';
        break;
      case 403:
        errorMessage = 'You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 422:
        errorMessage = response?.message || 'Validation failed. Please check your input.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
      case 503:
        errorMessage = 'Service temporarily unavailable. Please try again later.';
        break;
    }
  }
  
  // Handle network errors
  if (error instanceof Error) {
    if (error.message === 'Network Error') {
      errorMessage = 'Network error. Please check your internet connection.';
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
