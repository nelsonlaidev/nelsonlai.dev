'use client'

import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

type AlertDialogProps = AlertDialogPrimitive.Root.Props

function AlertDialog(props: AlertDialogProps) {
  return <AlertDialogPrimitive.Root data-slot='alert-dialog' {...props} />
}

type AlertDialogTriggerProps = AlertDialogPrimitive.Trigger.Props

function AlertDialogTrigger(props: AlertDialogTriggerProps) {
  return <AlertDialogPrimitive.Trigger data-slot='alert-dialog-trigger' {...props} />
}

type AlertDialogPortalProps = AlertDialogPrimitive.Portal.Props

function AlertDialogPortal(props: AlertDialogPortalProps) {
  return <AlertDialogPrimitive.Portal data-slot='alert-dialog-portal' {...props} />
}

type AlertDialogOverlayProps = AlertDialogPrimitive.Backdrop.Props

function AlertDialogOverlay(props: AlertDialogOverlayProps) {
  const { className, ...rest } = props

  return (
    <AlertDialogPrimitive.Backdrop
      data-slot='alert-dialog-overlay'
      className={cn(
        'fixed inset-0 isolate z-50 bg-black/80 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
        className,
      )}
      {...rest}
    />
  )
}

type AlertDialogContentProps = AlertDialogPrimitive.Popup.Props & {
  size?: 'default' | 'sm'
}

function AlertDialogContent(props: AlertDialogContentProps) {
  const { className, size = 'default', ...rest } = props

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot='alert-dialog-content'
        data-size={size}
        className={cn(
          'group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-1/2 gap-6 rounded-4xl bg-background p-6 ring-1 ring-foreground/5 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className,
        )}
        {...rest}
      />
    </AlertDialogPortal>
  )
}

type AlertDialogHeaderProps = React.ComponentProps<'div'>

function AlertDialogHeader(props: AlertDialogHeaderProps) {
  const { className, ...rest } = props

  return (
    <div
      data-slot='alert-dialog-header'
      className={cn(
        'grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]',
        className,
      )}
      {...rest}
    />
  )
}

type AlertDialogFooterProps = React.ComponentProps<'div'>

function AlertDialogFooter(props: AlertDialogFooterProps) {
  const { className, ...rest } = props

  return (
    <div
      data-slot='alert-dialog-footer'
      className={cn(
        'flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...rest}
    />
  )
}

type AlertDialogMediaProps = React.ComponentProps<'div'>

function AlertDialogMedia(props: AlertDialogMediaProps) {
  const { className, ...rest } = props

  return (
    <div
      data-slot='alert-dialog-media'
      className={cn(
        "mb-2 inline-flex size-16 items-center justify-center rounded-full bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-8",
        className,
      )}
      {...rest}
    />
  )
}

type AlertDialogTitleProps = React.ComponentProps<typeof AlertDialogPrimitive.Title>

function AlertDialogTitle(props: AlertDialogTitleProps) {
  const { className, ...rest } = props

  return (
    <AlertDialogPrimitive.Title
      data-slot='alert-dialog-title'
      className={cn(
        'text-lg font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2',
        className,
      )}
      {...rest}
    />
  )
}

type AlertDialogDescriptionProps = React.ComponentProps<typeof AlertDialogPrimitive.Description>

function AlertDialogDescription(props: AlertDialogDescriptionProps) {
  const { className, ...rest } = props

  return (
    <AlertDialogPrimitive.Description
      data-slot='alert-dialog-description'
      className={cn(
        'text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground',
        className,
      )}
      {...rest}
    />
  )
}

type AlertDialogActionProps = React.ComponentProps<typeof Button>

function AlertDialogAction(props: AlertDialogActionProps) {
  const { className, ...rest } = props

  return <Button data-slot='alert-dialog-action' className={cn(className)} {...rest} />
}

type AlertDialogCancelProps = AlertDialogPrimitive.Close.Props &
  Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'>

function AlertDialogCancel(props: AlertDialogCancelProps) {
  const { className, variant = 'outline', size = 'default', ...rest } = props

  return (
    <AlertDialogPrimitive.Close
      data-slot='alert-dialog-cancel'
      className={cn(className)}
      render={<Button variant={variant} size={size} />}
      {...rest}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
