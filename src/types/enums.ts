// User Status Enum
export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 2,
  INVITED = 3,
  SUSPENDED = 4,
}

// User Type Enum
export enum UserType {
  ADMIN = 1,
  MANAGER = 2,
  USER = 3,
}

// Status Options for Dropdowns
export const USER_STATUS_OPTIONS = [
  { label: 'Active', value: String(UserStatus.ACTIVE) },
  { label: 'Inactive', value: String(UserStatus.INACTIVE) },
  { label: 'Invited', value: String(UserStatus.INVITED) },
  { label: 'Suspended', value: String(UserStatus.SUSPENDED) },
];

export const USER_TYPE_OPTIONS = [
  { label: 'Admin', value: String(UserType.ADMIN) },
  { label: 'Manager', value: String(UserType.MANAGER) },
  { label: 'User', value: String(UserType.USER) },
];

// Helper functions
export function getUserStatusLabel(status: number): string {
  const option = USER_STATUS_OPTIONS.find(opt => opt.value === String(status));
  return option?.label || 'Unknown';
}

export function getUserTypeLabel(type: number): string {
  const option = USER_TYPE_OPTIONS.find(opt => opt.value === String(type));
  return option?.label || 'Unknown';
}

export function isActiveStatus(status: number): boolean {
  return status === UserStatus.ACTIVE;
}
