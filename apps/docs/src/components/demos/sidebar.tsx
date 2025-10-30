import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@repo/ui/components/sidebar'
import { CalendarIcon, HomeIcon, InboxIcon, SearchIcon, SettingsIcon } from 'lucide-react'

import SidebarTeamSwitcher from './sidebar-team-switcher'

const items = [
  {
    title: 'Home',
    url: '#',
    icon: HomeIcon
  },
  {
    title: 'Inbox',
    url: '#',
    icon: InboxIcon
  },
  {
    title: 'Calendar',
    url: '#',
    icon: CalendarIcon
  },
  {
    title: 'Search',
    url: '#',
    icon: SearchIcon
  },
  {
    title: 'Settings',
    url: '#',
    icon: SettingsIcon
  }
]

const SidebarDemo = () => {
  return (
    <SidebarProvider>
      <Sidebar collapsible='icon'>
        <SidebarHeader>
          <SidebarTeamSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className='flex h-12 items-center justify-between px-4'>
          <SidebarTrigger />
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SidebarDemo
