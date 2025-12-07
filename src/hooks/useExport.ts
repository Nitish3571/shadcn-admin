import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface ExportOptions {
  endpoint: string;
  filename?: string;
  format?: 'xlsx' | 'csv' | 'xls';
  params?: Record<string, any>;
}

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const token = useAuthStore((state) => state.token);

  const exportData = async ({
    endpoint,
    filename = 'export',
    format = 'xlsx',
    params = {},
  }: ExportOptions) => {
    setIsExporting(true);

    try {
      // Filter out undefined, null, and empty string values
      const cleanParams = Object.entries({ format, ...params })
        .filter(([_, value]) => {
          if (value === undefined || value === null) return false;
          if (typeof value === 'string' && value.trim() === '') return false;
          return true;
        })
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value as string }), {} as Record<string, string>);

      // Build query string
      const queryParams = new URLSearchParams(cleanParams).toString();

      const url = `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'}/${endpoint}?${queryParams}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get the blob
      const blob = await response.blob();

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return { success: true };
    } catch (error) {
      console.error('Export error:', error);
      return { success: false, error };
    } finally {
      setIsExporting(false);
    }
  };

  return { exportData, isExporting };
};
