'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

type DialogProps = DialogPrimitive.Root.Props

export function Dialog(props: DialogProps) {
  return <DialogPrimitive.Root data-slot='dialog' {...props} />
}

type DialogTriggerProps = DialogPrimitive.Trigger.Props

export function DialogTrigger(props: DialogTriggerProps) {
  return <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />
}

type DialogPortalProps = DialogPrimitive.Portal.Props

export function DialogPortal(props: DialogPortalProps) {
  return <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />
}

type DialogCloseProps = DialogPrimitive.Close.Props

export function DialogClose(props: DialogCloseProps) {
  return <DialogPrimitive.Close data-slot='dialog-close' {...props} />
}

type DialogOverlayProps = DialogPrimitive.Backdrop.Props

export function DialogOverlay(props: DialogOverlayProps) {
  const { className, ...rest } = props

  return (
    <DialogPrimitive.Backdrop
      data-slot='dialog-overlay'
      className={cn(
        'fixed inset-0 isolate z-50 bg-black/80 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
        className,
      )}
      {...rest}
    />
  )
}

type DialogContentProps = DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}

export function DialogContent(props: DialogContentProps) {
  const { className, children, showCloseButton = true, ...rest } = props
  const t = useTranslations()

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot='dialog-content'
        className={cn(
          'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-1/2 gap-6 rounded-4xl bg-background p-6 text-sm ring-1 ring-foreground/5 duration-100 outline-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className,
        )}
        {...rest}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot='dialog-close'
            render={
              <Button variant='ghost' className='absolute top-4 right-4' size='icon-sm'>
                <XIcon />
                <span className='sr-only'>{t('common.labels.close')}</span>
              </Button>
            }
          />
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

type DialogHeaderProps = React.ComponentProps<'div'>

export function DialogHeader(props: DialogHeaderProps) {
  const { className, ...rest } = props

  return <div data-slot='dialog-header' className={cn('flex flex-col gap-2', className)} {...rest} />
}

type DialogFooterProps = React.ComponentProps<'div'> & {
  showCloseButton?: boolean
}

export function DialogFooter(props: DialogFooterProps) {
  const { className, showCloseButton = false, children, ...rest } = props
  const t = useTranslations()

  return (
    <div
      data-slot='dialog-footer'
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...rest}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant='outline' />}>{t('common.labels.close')}</DialogPrimitive.Close>
      )}
    </div>
  )
}

type DialogTitleProps = DialogPrimitive.Title.Props

export function DialogTitle(props: DialogTitleProps) {
  const { className, ...rest } = props

  return (
    <DialogPrimitive.Title
      data-slot='dialog-title'
      className={cn('text-base leading-none font-medium', className)}
      {...rest}
    />
  )
}

type DialogDescriptionProps = DialogPrimitive.Description.Props

export function DialogDescription(props: DialogDescriptionProps) {
  const { className, ...rest } = props

  return (
    <DialogPrimitive.Description
      data-slot='dialog-description'
      className={cn(
        'text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground',
        className,
      )}
      {...rest}
    />
  )
}
