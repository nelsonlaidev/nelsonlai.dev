import { cva } from 'cva'
import { ChevronDownIcon } from 'lucide-react'
import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui'

import { cn } from '../utils/cn'

type NavigationMenuProps = React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}

const NavigationMenu = (props: NavigationMenuProps) => {
  const { className, children, viewport = true, ...rest } = props

  return (
    <NavigationMenuPrimitive.Root
      data-slot='navigation-menu'
      data-viewport={viewport}
      className={cn('group/navigation-menu relative flex max-w-max flex-1 items-center justify-center', className)}
      {...rest}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

type NavigationMenuListProps = React.ComponentProps<typeof NavigationMenuPrimitive.List>

const NavigationMenuList = (props: NavigationMenuListProps) => {
  const { className, ...rest } = props

  return (
    <NavigationMenuPrimitive.List
      data-slot='navigation-menu-list'
      className={cn('group flex flex-1 list-none items-center justify-center gap-1', className)}
      {...rest}
    />
  )
}

type NavigationMenuItemProps = React.ComponentProps<typeof NavigationMenuPrimitive.Item>

const NavigationMenuItem = (props: NavigationMenuItemProps) => {
  const { className, ...rest } = props

  return (
    <NavigationMenuPrimitive.Item data-slot='navigation-menu-item' className={cn('relative', className)} {...rest} />
  )
}

const navigationMenuTriggerStyle = cva({
  base: [
    'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-[color,box-shadow] outline-none',
    'hover:bg-accent hover:text-accent-foreground',
    'focus:bg-accent focus:text-accent-foreground',
    'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1',
    'disabled:pointer-events-none disabled:opacity-50',
    'data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent'
  ]
})

type NavigationMenuTriggerProps = React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>

const NavigationMenuTrigger = (props: NavigationMenuTriggerProps) => {
  const { className, children, ...rest } = props

  return (
    <NavigationMenuPrimitive.Trigger
      data-slot='navigation-menu-trigger'
      className={cn(navigationMenuTriggerStyle(), 'group', className)}
      {...rest}
    >
      {children}{' '}
      <ChevronDownIcon
        className={cn('relative top-[1px] ml-1 size-3 transition duration-300', 'group-data-[state=open]:rotate-180')}
        aria-hidden='true'
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

type NavigationMenuContentProps = React.ComponentProps<typeof NavigationMenuPrimitive.Content>

const NavigationMenuContent = (props: NavigationMenuContentProps) => {
  const { className, ...rest } = props

  return (
    <NavigationMenuPrimitive.Content
      data-slot='navigation-menu-content'
      className={cn(
        'top-0 left-0 w-full p-2 pr-2.5',
        'md:absolute md:w-auto',
        'data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in',
        'data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out',
        'data-[motion=from-start]:slide-in-from-left-52',
        'data-[motion=from-end]:slide-in-from-right-52',
        'data-[motion=to-start]:slide-out-to-left-52',
        'data-[motion=to-end]:slide-out-to-right-52',
        'group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow-sm group-data-[viewport=false]/navigation-menu:duration-200 group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95',
        '**:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none',
        className
      )}
      {...rest}
    />
  )
}

type NavigationMenuViewportProps = React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>

const NavigationMenuViewport = (props: NavigationMenuViewportProps) => {
  const { className, ...rest } = props

  return (
    <div className={cn('absolute top-full left-0 isolate z-50 flex justify-center')}>
      <NavigationMenuPrimitive.Viewport
        data-slot='navigation-menu-viewport'
        className={cn(
          'relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full origin-top overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-sm',
          'md:w-(--radix-navigation-menu-viewport-width)',
          'data-[state=open]:animate-in data-[state=open]:zoom-in-90',
          'data-[state=closed]:animate-out data-[state=closed]:zoom-out-95',
          className
        )}
        {...rest}
      />
    </div>
  )
}

type NavigationMenuLinkProps = React.ComponentProps<typeof NavigationMenuPrimitive.Link>

const NavigationMenuLink = (props: NavigationMenuLinkProps) => {
  const { className, ...rest } = props

  return (
    <NavigationMenuPrimitive.Link
      data-slot='navigation-menu-link'
      className={cn(
        'flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:bg-accent focus:text-accent-foreground',
        'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1',
        'data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground data-[active=true]:hover:bg-accent data-[active=true]:focus:bg-accent',
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...rest}
    />
  )
}

type NavigationMenuIndicatorProps = React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>

const NavigationMenuIndicator = (props: NavigationMenuIndicatorProps) => {
  const { className, ...rest } = props

  return (
    <NavigationMenuPrimitive.Indicator
      data-slot='navigation-menu-indicator'
      className={cn(
        'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden',
        'data-[state=visible]:animate-in data-[state=visible]:fade-in',
        'data-[state=hidden]:animate-out data-[state=hidden]:fade-out',
        className
      )}
      {...rest}
    >
      <div className='relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-border shadow-md' />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport
}
