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

import i18n from '@/i18n';

// Status Options for Dropdowns
export const getUserStatusOptions = () => [
  { label: i18n.t('active'), value: String(UserStatus.ACTIVE) },
  { label: i18n.t('inactive'), value: String(UserStatus.INACTIVE) },
  { label: i18n.t('invited'), value: String(UserStatus.INVITED) },
  { label: i18n.t('suspended'), value: String(UserStatus.SUSPENDED) },
];

export const getUserTypeOptions = () => [
  { label: i18n.t('admin_account'), value: String(UserType.ADMIN) },
  { label: i18n.t('regular_user'), value: String(UserType.USER) },
];

// Legacy exports for backward compatibility
export const USER_STATUS_OPTIONS = getUserStatusOptions();
export const USER_TYPE_OPTIONS = getUserTypeOptions();

// Helper functions
export function getUserStatusLabel(status: number): string {
  const options = getUserStatusOptions();
  const option = options.find(opt => opt.value === String(status));
  return option?.label || i18n.t('unknown');
}

/**
 * Get user type label for display
 * Note: This is for display only, not for access control
 */
export function getUserTypeLabel(type: number): string {
  const options = getUserTypeOptions();
  const option = options.find(opt => opt.value === String(type));
  return option?.label || i18n.t('unknown');
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
