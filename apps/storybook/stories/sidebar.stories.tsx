import { Button } from '@repo/ui/components/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@repo/ui/components/sidebar'
import { TooltipProvider } from '@repo/ui/components/tooltip'
import { CircleOffIcon, HomeIcon, LayersIcon, LinkIcon, MoreHorizontalIcon, PlusIcon } from 'lucide-react'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Sidebar',
  component: SidebarExample,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, height: '600px' },
    },
  },
})

function SidebarStatus() {
  const { state, isMobile, setOpenMobile } = useSidebar()

  return (
    <div className='space-y-3 p-4'>
      <output>{isMobile ? 'Mobile sheet navigation' : `Desktop sidebar: ${state}`}</output>
      <Button
        variant='outline'
        onClick={() => {
          setOpenMobile(false)
        }}
        className='md:hidden'
      >
        Close mobile navigation
      </Button>
    </div>
  )
}

type SidebarExampleProps = {
  collapsible?: 'offcanvas' | 'icon' | 'none'
  variant?: 'sidebar' | 'floating' | 'inset'
  side?: 'left' | 'right'
  open?: boolean
  loading?: boolean
}

function SidebarExample(props: SidebarExampleProps) {
  const { collapsible = 'icon', variant = 'sidebar', side = 'left', open = true, loading = false } = props

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={open} className={side === 'right' ? 'md:flex-row-reverse' : undefined}>
        <Sidebar
          collapsible={collapsible}
          variant={variant}
          side={side}
          className={collapsible === 'none' ? 'h-auto' : undefined}
        >
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size='lg'
                  tooltip='Storybook'
                  className='group-data-[collapsible=icon]:justify-center'
                >
                  <LayersIcon aria-hidden='true' />
                  <span className='group-data-[collapsible=icon]:sr-only'>Storybook</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarInput
              className='group-data-[collapsible=icon]:hidden'
              aria-label='Filter local navigation'
              placeholder='Filter navigation'
            />
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Local examples</SidebarGroupLabel>
              <SidebarGroupAction aria-label='Add local item'>
                <PlusIcon aria-hidden='true' />
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  {loading ? (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuSkeleton showIcon />
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuSkeleton />
                      </SidebarMenuItem>
                    </>
                  ) : (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive tooltip='Overview'>
                          <HomeIcon aria-hidden='true' />
                          <span>Overview</span>
                        </SidebarMenuButton>
                        <SidebarMenuBadge>12</SidebarMenuBadge>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton variant='outline' tooltip='Components'>
                          <LayersIcon aria-hidden='true' />
                          <span>Components</span>
                        </SidebarMenuButton>
                        <SidebarMenuAction showOnHover aria-label='More component actions'>
                          <MoreHorizontalIcon aria-hidden='true' />
                        </SidebarMenuAction>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton href='#button-example' isActive>
                              Button
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton href='#dialog-example' size='sm'>
                              Dialog
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton size='sm' disabled>
                          <CircleOffIcon aria-hidden='true' />
                          <span>Disabled item</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip='A very long label for truncation'>
                          <LayersIcon aria-hidden='true' />
                          <span>A very long navigation label that should truncate</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<a href='#local-footer' />} tooltip='Local footer link'>
                  <LinkIcon aria-hidden='true' />
                  <span>Local footer link</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarTrigger />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className='flex h-14 items-center gap-3 border-b px-4'>
            <SidebarTrigger />
            <span>Component preview</span>
          </header>
          <SidebarStatus />
          <p className='p-4 text-muted-foreground'>
            Resize to mobile, collapse to icons, or use Cmd/Ctrl+B. No website routes or accounts are involved.
          </p>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export const Expanded = meta.story()

export const CollapsedIcons = meta.story({ args: { open: false } })

export const Offcanvas = meta.story({ args: { collapsible: 'offcanvas' } })

export const Floating = meta.story({ args: { variant: 'floating' } })

export const Inset = meta.story({ args: { variant: 'inset' } })

export const Right = meta.story({ args: { side: 'right' } })

export const Static = meta.story({ args: { collapsible: 'none' } })

export const Loading = meta.story({ args: { loading: true } })
