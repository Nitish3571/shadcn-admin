import { useAuthStore } from '../stores/authStore';

/**
 * Hook for checking user permissions
 * 
 * @example
 * const { hasPermission, hasAllPermissions, hasRole } = usePermission();
 * 
 * // Check single permission
 * if (hasPermission('users.create')) { }
 * 
 * // Check multiple permissions (OR logic - user needs at least one)
 * if (hasPermission(['users.create', 'users.edit'])) { }
 * 
 * // Check multiple permissions (AND logic - user needs all)
 * if (hasAllPermissions(['users.create', 'users.edit'])) { }
 * 
 * // Check role
 * if (hasRole('Super Admin')) { }
 */
export const usePermission = () => {
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const hasAllPermissions = useAuthStore((state) => state.hasAllPermissions);
  const hasRole = useAuthStore((state) => state.hasRole);
  const userInfo = useAuthStore((state) => state.userInfo);

  return {
    hasPermission,
    hasAllPermissions,
    hasRole,
    permissions: userInfo?.permissions || [],
    roles: userInfo?.roles || [],
  };
};
