import { usePermissionSync } from '@/hooks/usePermissionSync';

/**
 * Wrapper component that handles permission synchronization
 * Separated to avoid interfering with other contexts
 */
export function PermissionSyncWrapper({ children }: { children: React.ReactNode }) {
  // Sync permissions every 5 minutes
  usePermissionSync(1 * 60 * 1000);
  
  return <>{children}</>;
}
