// User Status Enum
export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 2,
  INVITED = 3,
  SUSPENDED = 4,
}

/**
 * User Type - FOR CATEGORIZATION ONLY
 * 
 * This field is used for:
 * - User categorization in reports
 * - Different onboarding flows
 * - Analytics tracking
 * - UI customization
 * 
 * This field is NOT used for:
 * - Access control (use roles/permissions instead)
 * - Security decisions
 * - Route protection
 * 
 * Values:
 * 1 = Admin Account (internal staff)
 * 2 = Regular User (default for new users)
 */
export enum UserType {
  ADMIN = 1,
  USER = 2,
}

// Default user type for new users
export const DEFAULT_USER_TYPE = UserType.USER;

// Status Options for Dropdowns
export const USER_STATUS_OPTIONS = [
  { label: 'Active', value: String(UserStatus.ACTIVE) },
  { label: 'Inactive', value: String(UserStatus.INACTIVE) },
  { label: 'Invited', value: String(UserStatus.INVITED) },
  { label: 'Suspended', value: String(UserStatus.SUSPENDED) },
];

export const USER_TYPE_OPTIONS = [
  { label: 'Admin Account', value: String(UserType.ADMIN) },
  { label: 'Regular User', value: String(UserType.USER) },
];

// Helper functions
export function getUserStatusLabel(status: number): string {
  const option = USER_STATUS_OPTIONS.find(opt => opt.value === String(status));
  return option?.label || 'Unknown';
}

/**
 * Get user type label for display
 * Note: This is for display only, not for access control
 */
export function getUserTypeLabel(type: number): string {
  const option = USER_TYPE_OPTIONS.find(opt => opt.value === String(type));
  return option?.label || 'Unknown';
}

export function isActiveStatus(status: number): boolean {
  return status === UserStatus.ACTIVE;
}

/**
 * Check if user is admin account (for categorization only)
 * WARNING: Do NOT use this for access control!
 * Use hasPermission() or hasRole() instead.
 */
export function isAdminAccount(userType: number): boolean {
  return userType === UserType.ADMIN;
}
