import { ReactNode } from 'react';
import { usePermission } from '../../hooks/usePermission';

interface RoleGuardProps {
  role: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component to conditionally render children based on user roles
 * 
 * @example
 * // Show content only for Super Admin
 * <RoleGuard role=\"Super Admin\">
 *   <AdminPanel />
 * </RoleGuard>
 * 
 * // Multiple roles (OR logic)
 * <RoleGuard role={['Super Admin', 'Manager']}>
 *   <ManagementTools />
 * </RoleGuard>
 */
export const RoleGuard = ({
  role,
  children,
  fallback = null,
}: RoleGuardProps) => {
  const { hasRole } = usePermission();

  if (!hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
