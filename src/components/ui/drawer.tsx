'use client'

import { Drawer as DrawerPrimitive } from 'vaul'

import { cn } from '@/utils/cn'

type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root>

export function Drawer(props: DrawerProps) {
  // See: https://github.com/emilkowalski/vaul/issues/517#issuecomment-2571619213
  // oxlint-disable-next-line jsx_a11y/no-autofocus
  return <DrawerPrimitive.Root data-slot='drawer' autoFocus {...props} />
}

type DrawerTriggerProps = React.ComponentProps<typeof DrawerPrimitive.Trigger>

export function DrawerTrigger(props: DrawerTriggerProps) {
  return <DrawerPrimitive.Trigger data-slot='drawer-trigger' {...props} />
}

type DrawerPortalProps = React.ComponentProps<typeof DrawerPrimitive.Portal>

export function DrawerPortal(props: DrawerPortalProps) {
  return <DrawerPrimitive.Portal data-slot='drawer-portal' {...props} />
}

type DrawerCloseProps = React.ComponentProps<typeof DrawerPrimitive.Close>

export function DrawerClose(props: DrawerCloseProps) {
  return <DrawerPrimitive.Close data-slot='drawer-close' {...props} />
}

type DrawerOverlayProps = React.ComponentProps<typeof DrawerPrimitive.Overlay>

export function DrawerOverlay(props: DrawerOverlayProps) {
  const { className, ...rest } = props

  return (
    <DrawerPrimitive.Overlay
      data-slot='drawer-overlay'
      className={cn(
        'fixed inset-0 z-50 bg-black/80 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
        className,
      )}
      {...rest}
    />
  )
}

type DrawerContentProps = React.ComponentProps<typeof DrawerPrimitive.Content>

export function DrawerContent(props: DrawerContentProps) {
  const { className, children, ...rest } = props

  return (
    <DrawerPortal data-slot='drawer-portal'>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot='drawer-content'
        className={cn(
          'group/drawer-content fixed z-50 flex h-auto flex-col bg-transparent p-4 text-sm before:absolute before:inset-2 before:-z-10 before:rounded-4xl before:bg-background data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm',
          className,
        )}
        {...rest}
      >
        <div className='mx-auto mt-4 hidden h-1.5 w-25 shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block' />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

type DrawerHeaderProps = React.ComponentProps<'div'>

export function DrawerHeader(props: DrawerHeaderProps) {
  const { className, ...rest } = props

  return (
    <div
      data-slot='drawer-header'
      className={cn(
        'flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left',
        className,
      )}
      {...rest}
    />
  )
}

type DrawerFooterProps = React.ComponentProps<'div'>

export function DrawerFooter(props: DrawerFooterProps) {
  const { className, ...rest } = props

  return <div data-slot='drawer-footer' className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...rest} />
}

type DrawerTitleProps = React.ComponentProps<typeof DrawerPrimitive.Title>

export function DrawerTitle(props: DrawerTitleProps) {
  const { className, ...rest } = props

  return (
    <DrawerPrimitive.Title
      data-slot='drawer-title'
      className={cn('text-base font-medium text-foreground', className)}
      {...rest}
    />
  )
}

type DrawerDescriptionProps = React.ComponentProps<typeof DrawerPrimitive.Description>

export function DrawerDescription(props: DrawerDescriptionProps) {
  const { className, ...rest } = props

  return (
    <DrawerPrimitive.Description
      data-slot='drawer-description'
      className={cn('text-sm text-muted-foreground', className)}
      {...rest}
    />
  )
}
