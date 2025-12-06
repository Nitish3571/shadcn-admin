import { ReactNode } from 'react';
import { usePermission } from '../../hooks/usePermission';

interface PermissionGuardProps {
  permission: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean;
}

/**
 * Component to conditionally render children based on user permissions
 * 
 * @example
 * // Show button only if user has permission
 * <PermissionGuard permission=\"users.create\">
 *   <Button>Create User</Button>
 * </PermissionGuard>
 * 
 * // Multiple permissions (OR logic - default)
 * <PermissionGuard permission={['users.create', 'users.edit']}>
 *   <Button>Save</Button>
 * </PermissionGuard>
 * 
 * // Multiple permissions (AND logic - requires all)
 * <PermissionGuard permission={['users.create', 'users.edit']} requireAll>
 *   <Button>Save</Button>
 * </PermissionGuard>
 * 
 * // With fallback
 * <PermissionGuard permission=\"users.view\" fallback={<p>No access</p>}>
 *   <UserList />
 * </PermissionGuard>
 */
export const PermissionGuard = ({
  permission,
  children,
  fallback = null,
  requireAll = false,
}: PermissionGuardProps) => {
  const { hasPermission, hasAllPermissions } = usePermission();

  const hasAccess = requireAll && Array.isArray(permission)
    ? hasAllPermissions(permission)
    : hasPermission(permission);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
