'use client'

import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

type SheetProps = SheetPrimitive.Root.Props

export function Sheet(props: SheetProps) {
  return <SheetPrimitive.Root data-slot='sheet' {...props} />
}

type SheetTriggerProps = SheetPrimitive.Trigger.Props

export function SheetTrigger(props: SheetTriggerProps) {
  return <SheetPrimitive.Trigger data-slot='sheet-trigger' {...props} />
}

type SheetCloseProps = SheetPrimitive.Close.Props

export function SheetClose(props: SheetCloseProps) {
  return <SheetPrimitive.Close data-slot='sheet-close' {...props} />
}

type SheetPortalProps = SheetPrimitive.Portal.Props

export function SheetPortal(props: SheetPortalProps) {
  return <SheetPrimitive.Portal data-slot='sheet-portal' {...props} />
}

type SheetOverlayProps = SheetPrimitive.Backdrop.Props

export function SheetOverlay(props: SheetOverlayProps) {
  const { className, ...rest } = props

  return (
    <SheetPrimitive.Backdrop
      data-slot='sheet-overlay'
      className={cn(
        'fixed inset-0 z-50 bg-black/80 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs',
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

export function SheetContent(props: SheetContentProps) {
  const { className, children, side = 'right', showCloseButton = true, ...rest } = props
  const t = useTranslations()

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot='sheet-content'
        data-side={side}
        className={cn(
          'fixed z-50 flex flex-col bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-10 data-[side=bottom]:data-starting-style:translate-y-10 data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:-translate-x-10 data-[side=left]:data-starting-style:-translate-x-10 data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-10 data-[side=right]:data-starting-style:translate-x-10 data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:-translate-y-10 data-[side=top]:data-starting-style:-translate-y-10 sm:data-[side=left]:max-w-sm sm:data-[side=right]:max-w-sm',
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
                <span className='sr-only'>{t('common.labels.close')}</span>
              </Button>
            }
          />
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

type SheetHeaderProps = React.ComponentProps<'div'>

export function SheetHeader(props: SheetHeaderProps) {
  const { className, ...rest } = props

  return <div data-slot='sheet-header' className={cn('flex flex-col gap-1.5 p-6', className)} {...rest} />
}

type SheetFooterProps = React.ComponentProps<'div'>

export function SheetFooter(props: SheetFooterProps) {
  const { className, ...rest } = props

  return <div data-slot='sheet-footer' className={cn('mt-auto flex flex-col gap-2 p-6', className)} {...rest} />
}

type SheetTitleProps = SheetPrimitive.Title.Props

export function SheetTitle(props: SheetTitleProps) {
  const { className, ...rest } = props

  return (
    <SheetPrimitive.Title
      data-slot='sheet-title'
      className={cn('font-heading text-base font-medium text-foreground', className)}
      {...rest}
    />
  )
}

type SheetDescriptionProps = SheetPrimitive.Description.Props

export function SheetDescription(props: SheetDescriptionProps) {
  const { className, ...rest } = props

  return (
    <SheetPrimitive.Description
      data-slot='sheet-description'
      className={cn('text-sm text-muted-foreground', className)}
      {...rest}
    />
  )
}
