import {
  CalendarIcon,
  FolderIcon,
  InboxIcon,
  LayoutGridIcon,
  LifeBuoyIcon,
  LogOutIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react'

import { Button } from '../ui/button'
import { Demo, DemoItem } from '../ui/demo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '../ui/sidebar'

const MAIN_LINKS = [
  { label: 'Dashboard', icon: LayoutGridIcon, active: true },
  { label: 'Projects', icon: FolderIcon },
  { label: 'Calendar', icon: CalendarIcon },
  { label: 'Inbox', icon: InboxIcon, badge: '3' },
  { label: 'Team', icon: UsersIcon },
]

const FOOTER_LINKS = [
  { label: 'Settings', icon: SettingsIcon },
  { label: 'Support', icon: LifeBuoyIcon },
]

function SidebarDemo() {
  return (
    <Demo title='Sidebar' className='md:grid-cols-1'>
      <SidebarBasic />
    </Demo>
  )
}

function SidebarBasic() {
  return (
    <DemoItem title='Basic' orientation='vertical'>
      <SidebarProvider className='min-h-0 w-full overflow-hidden rounded-2xl border'>
        <Sidebar collapsible='none' className='min-h-160'>
          <SidebarHeader>
            <div className='flex items-center gap-3 px-2 pt-2'>
              <div className='flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground'>
                NL
              </div>
              <div className='flex flex-col leading-tight'>
                <span className='text-sm font-semibold'>Nelson Labs</span>
                <span className='text-xs text-muted-foreground'>Design team</span>
              </div>
            </div>
            <SidebarInput placeholder='Search workspace...' />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {MAIN_LINKS.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton isActive={item.active}>
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              {FOOTER_LINKS.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <LogOutIcon />
                  <span>Log out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className='flex flex-1 flex-col'>
          <div className='flex items-center gap-2 border-b px-4 py-3'>
            <div>
              <div className='text-xs text-muted-foreground'>Workspace</div>
              <div className='text-sm font-medium text-foreground'>Sprint overview</div>
            </div>
            <div className='ml-auto flex items-center gap-2'>
              <Button size='sm' variant='outline'>
                Share
              </Button>
              <Button size='sm'>New</Button>
            </div>
          </div>
          <div className='flex flex-1 flex-col gap-3 p-4 text-sm text-muted-foreground'>
            <div className='rounded-xl border bg-muted/40 p-4 text-foreground'>
              <div className='text-xs text-muted-foreground'>This week</div>
              <div className='mt-1 text-lg font-semibold'>12 tasks completed</div>
              <p className='mt-1 text-sm text-muted-foreground'>Shipping faster with focused sprints.</p>
            </div>
            <div className='grid gap-3 sm:grid-cols-2'>
              <div className='rounded-xl border p-4'>
                <div className='text-xs text-muted-foreground'>In progress</div>
                <div className='mt-2 text-base font-medium text-foreground'>Feature refresh</div>
                <p className='mt-1 text-sm'>3 open items due Friday.</p>
              </div>
              <div className='rounded-xl border p-4'>
                <div className='text-xs text-muted-foreground'>Upcoming</div>
                <div className='mt-2 text-base font-medium text-foreground'>User testing</div>
                <p className='mt-1 text-sm'>Prepare prototype and checklist.</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </DemoItem>
  )
}

export default SidebarDemo
