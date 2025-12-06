import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

const LAST_SYNC_KEY = 'permission_last_sync';

/**
 * Hook to periodically sync user permissions from the server
 * This ensures users see permission changes without needing to logout/login
 * 
 * @param intervalMs - How often to check for updates (default: 5 minutes)
 */
export function usePermissionSync(intervalMs: number = 5 * 60 * 1000) {
  const refreshUserInfo = useAuthStore((state) => state.refreshUserInfo);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) return;

    // Check if we need to refresh based on last sync time
    const lastSync = localStorage.getItem(LAST_SYNC_KEY);
    const now = Date.now();
    const shouldRefresh = !lastSync || (now - parseInt(lastSync)) > intervalMs;

    if (shouldRefresh) {
      refreshUserInfo();
      localStorage.setItem(LAST_SYNC_KEY, now.toString());
    }

    // Set up periodic refresh
    const interval = setInterval(() => {
      refreshUserInfo();
      localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    }, intervalMs);

    return () => clearInterval(interval);
  }, [token, intervalMs, refreshUserInfo]);
}
