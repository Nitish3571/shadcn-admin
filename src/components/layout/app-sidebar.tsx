import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { getSidebarData } from './data/sidebar-data'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { i18n } = useTranslation();
  
  // Recalculate sidebar data when language changes
  const sidebarData = useMemo(() => getSidebarData(), [i18n.language])
  
  return (
    <Sidebar collapsible='icon' variant='sidebar' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
