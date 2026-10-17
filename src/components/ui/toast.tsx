'use client'

import { Toast as ToastPrimitive } from '@base-ui/react/toast'
import { cn } from 'cn'
import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export const toast = ToastPrimitive.createToastManager()

type ToastProviderProps = ToastPrimitive.Provider.Props

export function ToastProvider(props: ToastProviderProps) {
  return <ToastPrimitive.Provider {...props} />
}

type ToastPortalProps = ToastPrimitive.Portal.Props

export function ToastPortal(props: ToastPortalProps) {
  return <ToastPrimitive.Portal data-slot='toast-portal' {...props} />
}

type ToastViewportProps = ToastPrimitive.Viewport.Props

export function ToastViewport(props: ToastViewportProps) {
  const { className, ...rest } = props

  return (
    <ToastPrimitive.Viewport
      data-slot='toast-viewport'
      className={cn(
        'pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none',
        'sm:right-4 sm:left-auto sm:mx-0 sm:w-full',
        className,
      )}
      {...rest}
    />
  )
}

type ToastProps = ToastPrimitive.Root.Props

export function Toast(props: ToastProps) {
  const { className, ...rest } = props

  return (
    <ToastPrimitive.Root
      data-slot='toast'
      className={cn(
        'group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-2xl border bg-popover text-popover-foreground shadow-lg will-change-transform outline-none select-none',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        '[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]',
        'h-(--height) transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]',
        '[transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]',
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        'data-expanded:h-(--toast-height) data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]',
        'data-limited:opacity-0 data-starting-style:transform-[translateY(150%)]',
        '[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(150%)]',
        'data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]',
        'data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
        'data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
        'data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]',
        'data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]',
        'data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
        'data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
        'data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]',
        className,
      )}
      {...rest}
    />
  )
}

type ToastContentProps = ToastPrimitive.Content.Props

export function ToastContent(props: ToastContentProps) {
  const { className, ...rest } = props

  return (
    <ToastPrimitive.Content
      data-slot='toast-content'
      className={cn(
        'flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'data-behind:opacity-0',
        'data-expanded:opacity-100',
        className,
      )}
      {...rest}
    />
  )
}

type ToastTitleProps = ToastPrimitive.Title.Props

export function ToastTitle(props: ToastTitleProps) {
  const { className, ...rest } = props

  return <ToastPrimitive.Title data-slot='toast-title' className={cn('text-sm font-medium', className)} {...rest} />
}

type ToastDescriptionProps = ToastPrimitive.Description.Props

export function ToastDescription(props: ToastDescriptionProps) {
  const { className, ...rest } = props

  return (
    <ToastPrimitive.Description
      data-slot='toast-description'
      className={cn('text-sm text-muted-foreground', className)}
      {...rest}
    />
  )
}

type ToastActionProps = ToastPrimitive.Action.Props

export function ToastAction(props: ToastActionProps) {
  const { className, render, ...rest } = props

  return (
    <ToastPrimitive.Action
      data-slot='toast-action'
      render={render ?? <Button variant='outline' size='sm' />}
      className={cn('shrink-0', className)}
      {...rest}
    />
  )
}

type ToastCloseProps = ToastPrimitive.Close.Props

export function ToastClose(props: ToastCloseProps) {
  const { className, children, render, ...rest } = props

  return (
    <ToastPrimitive.Close
      data-slot='toast-close'
      aria-label='Close toast'
      render={render ?? <Button variant='ghost' size='icon-sm' />}
      className={cn(
        "relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground",
        className,
      )}
      {...rest}
    >
      {children ?? <XIcon aria-hidden='true' />}
    </ToastPrimitive.Close>
  )
}

type ToastIconProps = {
  type: string | undefined
}

function ToastIcon(props: ToastIconProps) {
  const { type } = props

  let icon: React.ReactNode = null

  if (type === 'success') {
    icon = <CircleCheckIcon aria-hidden='true' />
  }

  if (type === 'info') {
    icon = <InfoIcon aria-hidden='true' />
  }

  if (type === 'warning') {
    icon = <TriangleAlertIcon aria-hidden='true' />
  }

  if (type === 'error') {
    icon = <OctagonXIcon className='text-destructive' aria-hidden='true' />
  }

  if (type === 'loading') {
    icon = <Spinner aria-hidden='true' />
  }

  if (!icon) {
    return null
  }

  return (
    <span data-slot='toast-icon' className="shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4">
      {icon}
    </span>
  )
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager<{ testId?: string }>()

  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem} data-testid={toastItem.data?.testId}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <div className='flex min-w-0 flex-1 flex-col gap-1'>
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ))
}

type ToasterProps = ToastPrimitive.Provider.Props

export function Toaster(props: ToasterProps) {
  const { children, toastManager = toast, ...rest } = props

  return (
    <ToastProvider toastManager={toastManager} {...rest}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}

export const createToastManager = ToastPrimitive.createToastManager
export const useToastManager = ToastPrimitive.useToastManager
