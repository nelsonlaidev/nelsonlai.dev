'use client'

import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

type SheetProps = SheetPrimitive.Root.Props

function Sheet(props: SheetProps) {
  return <SheetPrimitive.Root data-slot='sheet' {...props} />
}

type SheetTriggerProps = SheetPrimitive.Trigger.Props

function SheetTrigger(props: SheetTriggerProps) {
  return <SheetPrimitive.Trigger data-slot='sheet-trigger' {...props} />
}

type SheetCloseProps = SheetPrimitive.Close.Props

function SheetClose(props: SheetCloseProps) {
  return <SheetPrimitive.Close data-slot='sheet-close' {...props} />
}

type SheetPortalProps = SheetPrimitive.Portal.Props

function SheetPortal(props: SheetPortalProps) {
  return <SheetPrimitive.Portal data-slot='sheet-portal' {...props} />
}

type SheetOverlayProps = SheetPrimitive.Backdrop.Props

function SheetOverlay(props: SheetOverlayProps) {
  const { className, ...rest } = props

  return (
    <SheetPrimitive.Backdrop
      data-slot='sheet-overlay'
      className={cn(
        'fixed inset-0 z-50 bg-black/80 duration-100 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
        className,
      )}
      {...rest}
    />
  )
}

type SheetContentProps = SheetPrimitive.Popup.Props & {
  side?: 'top' | 'right' | 'bottom' | 'left'
  showCloseButton?: boolean
}

function SheetContent(props: SheetContentProps) {
  const { className, children, side = 'right', showCloseButton = true, ...rest } = props

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot='sheet-content'
        data-side={side}
        className={cn(
          'fixed z-50 flex flex-col bg-background bg-clip-padding text-sm shadow-lg transition duration-200 ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-[side=bottom]:data-open:slide-in-from-bottom-10 data-[side=left]:data-open:slide-in-from-left-10 data-[side=right]:data-open:slide-in-from-right-10 data-[side=top]:data-open:slide-in-from-top-10 data-closed:animate-out data-closed:fade-out-0 data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=left]:data-closed:slide-out-to-left-10 data-[side=right]:data-closed:slide-out-to-right-10 data-[side=top]:data-closed:slide-out-to-top-10',
          className,
        )}
        {...rest}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot='sheet-close'
            render={
              <Button variant='ghost' className='absolute top-4 right-4' size='icon-sm'>
                <XIcon />
                <span className='sr-only'>Close</span>
              </Button>
            }
          />
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

type SheetHeaderProps = React.ComponentProps<'div'>

function SheetHeader(props: SheetHeaderProps) {
  const { className, ...rest } = props

  return <div data-slot='sheet-header' className={cn('flex flex-col gap-1.5 p-6', className)} {...rest} />
}

type SheetFooterProps = React.ComponentProps<'div'>

function SheetFooter(props: SheetFooterProps) {
  const { className, ...rest } = props

  return <div data-slot='sheet-footer' className={cn('mt-auto flex flex-col gap-2 p-6', className)} {...rest} />
}

type SheetTitleProps = SheetPrimitive.Title.Props

function SheetTitle(props: SheetTitleProps) {
  const { className, ...rest } = props

  return (
    <SheetPrimitive.Title
      data-slot='sheet-title'
      className={cn('text-base font-medium text-foreground', className)}
      {...rest}
    />
  )
}

type SheetDescriptionProps = SheetPrimitive.Description.Props

function SheetDescription(props: SheetDescriptionProps) {
  const { className, ...rest } = props

  return (
    <SheetPrimitive.Description
      data-slot='sheet-description'
      className={cn('text-sm text-muted-foreground', className)}
      {...rest}
    />
  )
}

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger }
