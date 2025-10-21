import {
  IconShield,
  IconUser,
  IconUserShield,
} from '@tabler/icons-react'

export const callTypes = new Map<number, string>([
  [1, 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  [0, 'bg-neutral-300/40 border-neutral-300'],
])

export const userTypes = [
  {
    label: 'Superadmin',
    value: '1',
    icon: IconShield,
  },
  {
    label: 'Admin',
    value: '2',
    icon: IconUserShield,
  },
  {
    label: 'User',
    value: '3',
    icon: IconUser,
  },
] as const
