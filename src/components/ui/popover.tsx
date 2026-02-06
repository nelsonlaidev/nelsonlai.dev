'use client'

import { Popover as PopoverPrimitive } from '@base-ui/react/popover'

import { cn } from '@/utils/cn'

type PopoverProps = PopoverPrimitive.Root.Props

function Popover(props: PopoverProps) {
  return <PopoverPrimitive.Root data-slot='popover' {...props} />
}

type PopoverTriggerProps = PopoverPrimitive.Trigger.Props

function PopoverTrigger(props: PopoverTriggerProps) {
  return <PopoverPrimitive.Trigger data-slot='popover-trigger' {...props} />
}

type PopoverContentProps = PopoverPrimitive.Popup.Props &
  Pick<PopoverPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>

function PopoverContent(props: PopoverContentProps) {
  const { className, align = 'center', alignOffset = 0, side = 'bottom', sideOffset = 4, ...rest } = props

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className='isolate z-50'
      >
        <PopoverPrimitive.Popup
          data-slot='popover-content'
          className={cn(
            'z-50 flex w-72 origin-(--transform-origin) flex-col gap-4 rounded-2xl bg-popover p-4 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            className,
          )}
          {...rest}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

type PopoverHeaderProps = React.ComponentProps<'div'>

function PopoverHeader(props: PopoverHeaderProps) {
  const { className, ...rest } = props

  return <div data-slot='popover-header' className={cn('flex flex-col gap-1 text-sm', className)} {...rest} />
}

type PopoverTitleProps = PopoverPrimitive.Title.Props

function PopoverTitle(props: PopoverTitleProps) {
  const { className, ...rest } = props

  return (
    <PopoverPrimitive.Title data-slot='popover-title' className={cn('text-base font-medium', className)} {...rest} />
  )
}

type PopoverDescriptionProps = PopoverPrimitive.Description.Props

function PopoverDescription(props: PopoverDescriptionProps) {
  const { className, ...rest } = props

  return (
    <PopoverPrimitive.Description
      data-slot='popover-description'
      className={cn('text-muted-foreground', className)}
      {...rest}
    />
  )
}

export { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger }
