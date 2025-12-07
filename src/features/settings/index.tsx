import PageLayout from '@/components/shared/layout/page-layout'
import {
  IconBrowserCheck,
  IconKey,
  IconNotification,
  IconPalette,
  IconTool,
  IconUser,
} from '@tabler/icons-react'
import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

export default function Settings() {
  const location = useLocation()
  const { t } = useTranslation()
  
  const isActive = (href: string) => {
    if (href === '/settings') {
      return location.pathname === '/settings'
    }
    return location.pathname.startsWith(href)
  }

  const sidebarNavItems = [
    {
      title: t('profile'),
      icon: <IconUser size={18} />,
      href: '/settings',
    },
    {
      title: t('account'),
      icon: <IconTool size={18} />,
      href: '/settings/account',
    },
    {
      title: t('security'),
      icon: <IconKey size={18} />,
      href: '/settings/security',
    },
    {
      title: t('appearance'),
      icon: <IconPalette size={18} />,
      href: '/settings/appearance',
    },
    {
      title: t('notifications'),
      icon: <IconNotification size={18} />,
      href: '/settings/notifications',
    },
    {
      title: t('display'),
      icon: <IconBrowserCheck size={18} />,
      href: '/settings/display',
    },
  ]

  return (
    <PageLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            {t('settings')}
          </h1>
          <p className='text-muted-foreground text-sm'>
            {t('manage_account_settings')}
          </p>
        </div>
        
        {/* Horizontal Navigation Tabs */}
        <div className='border-b'>
          <nav className='flex gap-1 overflow-x-auto' aria-label='Settings tabs'>
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap',
                  isActive(item.href)
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                )}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Content */}
        <div>
          <Outlet />
        </div>
      </div>
    </PageLayout>
  )
}
