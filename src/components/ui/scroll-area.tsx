'use client'

import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area'

import { cn } from '@/utils/cn'

type ScrollAreaProps = ScrollAreaPrimitive.Root.Props

export function ScrollArea(props: ScrollAreaProps) {
  const { className, children, ...rest } = props

  return (
    <ScrollAreaPrimitive.Root data-slot='scroll-area' className={cn('relative flex flex-col', className)} {...rest}>
      <ScrollAreaPrimitive.Viewport data-slot='scroll-area-viewport' className='grow'>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollBar orientation='horizontal' />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

type ScrollBarProps = ScrollAreaPrimitive.Scrollbar.Props

export function ScrollBar(props: ScrollBarProps) {
  const { className, orientation = 'vertical', ...rest } = props

  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot='scroll-area-scrollbar'
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        'pointer-events-none m-2 flex rounded-full bg-neutral-200 opacity-0 transition-opacity data-hovering:pointer-events-auto data-hovering:opacity-100 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-horizontal:h-1.5 data-vertical:w-1.5',
        className,
      )}
      {...rest}
    >
      <ScrollAreaPrimitive.Thumb data-slot='scroll-area-thumb' className='w-full rounded-full bg-neutral-400' />
    </ScrollAreaPrimitive.Scrollbar>
  )
}
