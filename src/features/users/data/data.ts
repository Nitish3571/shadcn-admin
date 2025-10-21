import {
  IconShield,
  IconUser,
  IconUsersGroup,
  IconUserShield,
} from '@tabler/icons-react'

export const callTypes = new Map<number, string>([
  [1, 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  [0, 'bg-neutral-300/40 border-neutral-300'],
])

export const userTypes = [
  {
    label: 'Superadmin',
    value: 'superadmin',
    icon: IconShield,
  },
  {
    label: 'Admin',
    value: 'admin',
    icon: IconUserShield,
  },
  {
    label: 'Manager',
    value: 'manager',
    icon: IconUsersGroup,
  },
  {
    label: 'User',
    value: 'user',
    icon: IconUser,
  },
] as const
