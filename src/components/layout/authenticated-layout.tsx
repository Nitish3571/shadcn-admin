import Cookies from 'js-cookie'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'
import { useAuthStore } from '@/stores/authStore'
import { Header } from './header'
import { Search } from '../search'
import { ThemeSwitch } from '../theme-switch'
import { ProfileDropdown } from '../profile-dropdown'
import { sidebarData } from './data/sidebar-data'

interface Props {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: Props) {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const navigate = useNavigate()
  const { token } = useAuthStore()
  if (!token) {
    navigate({
      to: '/sign-in-2',
      replace: true,
    })
    return null
  }
  return (
    <SearchProvider>

      <SidebarProvider defaultOpen={defaultOpen}>

        <SkipToMain />
        <AppSidebar />

        <div
          id='content'
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'sm:transition-[width] sm:duration-200 sm:ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
          )}
        >
          <Header fixed>
            <Search />
            <div className='ml-auto flex items-center space-x-4'>
              <ThemeSwitch />
              <ProfileDropdown user={sidebarData.user} />
            </div>
          </Header>
          {children ? children : <Outlet />}
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
