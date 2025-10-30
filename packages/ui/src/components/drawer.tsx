import { Drawer as DrawerPrimitive } from 'vaul'

import { cn } from '../utils/cn'

type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root>

const Drawer = (props: DrawerProps) => {
  return <DrawerPrimitive.Root data-slot='drawer' {...props} />
}

type DrawerTriggerProps = React.ComponentProps<typeof DrawerPrimitive.Trigger>

const DrawerTrigger = (props: DrawerTriggerProps) => {
  return <DrawerPrimitive.Trigger data-slot='drawer-trigger' {...props} />
}

type DrawerPortalProps = React.ComponentProps<typeof DrawerPrimitive.Portal>

const DrawerPortal = (props: DrawerPortalProps) => {
  return <DrawerPrimitive.Portal data-slot='drawer-portal' {...props} />
}

type DrawerCloseProps = React.ComponentProps<typeof DrawerPrimitive.Close>

const DrawerClose = (props: DrawerCloseProps) => {
  return <DrawerPrimitive.Close data-slot='drawer-close' {...props} />
}

type DrawerOverlayProps = React.ComponentProps<typeof DrawerPrimitive.Overlay>

const DrawerOverlay = (props: DrawerOverlayProps) => {
  const { className, ...rest } = props

  return (
    <DrawerPrimitive.Overlay
      data-slot='drawer-overlay'
      className={cn(
        'fixed inset-0 z-50 bg-black/50',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        className
      )}
      {...rest}
    />
  )
}

type DrawerContentProps = React.ComponentProps<typeof DrawerPrimitive.Content>

const DrawerContent = (props: DrawerContentProps) => {
  const { className, children, ...rest } = props

  return (
    <DrawerPortal data-slot='drawer-portal'>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot='drawer-content'
        className={cn(
          'group/drawer-content fixed z-50 flex h-auto flex-col bg-background',
          'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b',
          'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t',
          'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm',
          'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm',
          className
        )}
        {...rest}
      >
        <div
          className={cn(
            'mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full bg-muted',
            'group-data-[vaul-drawer-direction=bottom]/drawer-content:block'
          )}
        />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

type DrawerHeaderProps = React.ComponentProps<'div'>

const DrawerHeader = (props: DrawerHeaderProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='drawer-header'
      className={cn(
        'flex flex-col gap-0.5 p-4',
        'md:gap-1.5 md:text-left',
        'group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center',
        'group-data-[vaul-drawer-direction=top]/drawer-content:text-center',
        className
      )}
      {...rest}
    />
  )
}

type DrawerFooterProps = React.ComponentProps<'div'>

const DrawerFooter = (props: DrawerFooterProps) => {
  const { className, ...rest } = props

  return <div data-slot='drawer-footer' className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...rest} />
}

type DrawerTitleProps = React.ComponentProps<typeof DrawerPrimitive.Title>

const DrawerTitle = (props: DrawerTitleProps) => {
  const { className, ...rest } = props

  return (
    <DrawerPrimitive.Title
      data-slot='drawer-title'
      className={cn('font-semibold text-foreground', className)}
      {...rest}
    />
  )
}

type DrawerDescriptionProps = React.ComponentProps<typeof DrawerPrimitive.Description>

const DrawerDescription = (props: DrawerDescriptionProps) => {
  const { className, ...rest } = props

  return (
    <DrawerPrimitive.Description
      data-slot='drawer-description'
      className={cn('text-sm text-muted-foreground', className)}
      {...rest}
    />
  )
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger
}
