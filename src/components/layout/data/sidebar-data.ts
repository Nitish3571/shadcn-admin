import {
  IconBrowserCheck,
  IconHelp,
  IconLayoutDashboard,
  IconNotification,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUsers
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'
import { useAuthStore } from '@/stores/authStore'


const userData = useAuthStore.getState().userInfo;

export const getSidebarData = (): SidebarData => {
  const hasPermission = useAuthStore.getState().hasPermission;

  return {
    user: {
      name: userData?.name || 'Rana Jee',
      email: userData?.email || 'rjee@gmail.com',
      avatar: userData?.name?.split(" ").map(word => word.slice(0, 1)).join('') || '/avatars/shadcn.jpg',
    },
    teams: [
      {
        name: 'Shadcn Admin',
        logo: Command,
        plan: 'Vite + ShadcnUI',
      },
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup',
      },
    ],
    navGroups: [
      {
        title: 'General',
        items: [
          {
            title: 'Dashboard',
            url: '/' as const,
            icon: IconLayoutDashboard,
          },
          ...(hasPermission('users.view') ? [{
            title: 'Users',
            url: '/users' as const,
            icon: IconUsers,
          }] : []),
          ...(hasPermission('roles.view') ? [{
            title: 'Roles',
            url: '/roles' as const,
            icon: IconUserCog,
          }] : [])
        ],
      },
      {
        title: 'Other',
        items: [
          {
            title: 'Settings',
            icon: IconSettings,
            items: [
              {
                title: 'Profile',
                url: '/settings',
                icon: IconUserCog,
              },
              {
                title: 'Account',
                url: '/settings/account',
                icon: IconTool,
              },
              {
                title: 'Appearance',
                url: '/settings/appearance',
                icon: IconPalette,
              },
              {
                title: 'Notifications',
                url: '/settings/notifications',
                icon: IconNotification,
              },
              {
                title: 'Display',
                url: '/settings/display',
                icon: IconBrowserCheck,
              },
            ],
          },
          {
            title: 'Help Center',
            url: '/help-center',
            icon: IconHelp,
          },
        ],
      },
    ],
  }
}

// For backward compatibility
export const sidebarData = getSidebarData()
