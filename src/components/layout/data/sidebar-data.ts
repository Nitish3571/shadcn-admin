import {
  IconBrowserCheck,
  IconHelp,
  IconKey,
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
import i18n from '@/i18n'

const userData = useAuthStore.getState().userInfo;

export const getSidebarData = (): SidebarData => {
  const hasPermission = useAuthStore.getState().hasPermission;
  const t = i18n.t;

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
        title: t('general'),
        items: [
          {
            title: t('dashboard'),
            url: '/' as const,
            icon: IconLayoutDashboard,
          },
          ...(hasPermission('users.view') ? [{
            title: t('users'),
            url: '/users' as const,
            icon: IconUsers,
          }] : []),
          ...(hasPermission('roles.view') ? [{
            title: t('roles'),
            url: '/roles' as const,
            icon: IconUserCog,
          }] : [])
        ],
      },
      {
        title: t('other'),
        items: [
          {
            title: t('settings'),
            icon: IconSettings,
            items: [
              {
                title: t('profile'),
                url: '/settings',
                icon: IconUserCog,
              },
              {
                title: t('account'),
                url: '/settings/account',
                icon: IconTool,
              },
              {
                title: t('security'),
                url: '/settings/security',
                icon: IconKey,
              },
              {
                title: t('appearance'),
                url: '/settings/appearance',
                icon: IconPalette,
              },
              {
                title: t('notifications'),
                url: '/settings/notifications',
                icon: IconNotification,
              },
              {
                title: t('display'),
                url: '/settings/display',
                icon: IconBrowserCheck,
              },
            ],
          },
          ...(hasPermission('activity_logs.view') ? [{
            title: t('activity_logs'),
            url: '/activity-logs' as const,
            icon: IconUserCog,
          }] : []),
          {
            title: t('login_history'),
            url: '/login-history' as const,
            icon: IconKey,
          },
          {
            title: t('help_center'),
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
