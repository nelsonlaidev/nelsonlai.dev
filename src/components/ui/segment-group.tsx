'use client'

import type { VariantProps } from 'class-variance-authority'

import { SegmentGroup as SegmentGroupPrimitive } from '@ark-ui/react/segment-group'
import { cva } from 'class-variance-authority'
import { cn } from 'cn'

export { useSegmentGroup } from '@ark-ui/react/segment-group'

export const segmentGroupVariants = cva(
  [
    'group/segment-group isolate inline-flex w-fit items-center justify-center rounded-4xl bg-muted p-0.75 text-muted-foreground',
    'data-vertical:h-fit data-vertical:flex-col data-vertical:items-stretch data-vertical:rounded-2xl',
  ],
  {
    variants: {
      size: {
        sm: 'h-8',
        default: 'h-9',
        lg: 'h-10',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

type SegmentGroupProps = Omit<React.ComponentProps<typeof SegmentGroupPrimitive.Root>, 'asChild'> &
  VariantProps<typeof segmentGroupVariants>

export function SegmentGroup(props: SegmentGroupProps) {
  const { className, size = 'default', orientation = 'horizontal', children, ...rest } = props

  return (
    <SegmentGroupPrimitive.Root
      data-slot='segment-group'
      data-size={size}
      orientation={orientation}
      className={cn(segmentGroupVariants({ size }), className)}
      {...rest}
    >
      <SegmentGroupIndicator />
      {children}
    </SegmentGroupPrimitive.Root>
  )
}

type SegmentGroupRootProviderProps = Omit<React.ComponentProps<typeof SegmentGroupPrimitive.RootProvider>, 'asChild'> &
  VariantProps<typeof segmentGroupVariants>

export function SegmentGroupRootProvider(props: SegmentGroupRootProviderProps) {
  const { className, size = 'default', children, ...rest } = props

  return (
    <SegmentGroupPrimitive.RootProvider
      data-slot='segment-group'
      data-size={size}
      className={cn(segmentGroupVariants({ size }), className)}
      {...rest}
    >
      <SegmentGroupIndicator />
      {children}
    </SegmentGroupPrimitive.RootProvider>
  )
}

function SegmentGroupIndicator() {
  return (
    <SegmentGroupPrimitive.Indicator
      data-slot='segment-group-indicator'
      className={cn(
        'pointer-events-none absolute top-(--top) left-(--left) z-0 h-(--height) w-(--width) rounded-xl border border-transparent bg-background [--transition-timing-function:ease-in-out]',
        'motion-reduce:transition-none!',
        'dark:border-input dark:bg-input/30',
      )}
    />
  )
}

type SegmentGroupItemProps = Omit<React.ComponentProps<typeof SegmentGroupPrimitive.Item>, 'asChild'>

export function SegmentGroupItem(props: SegmentGroupItemProps) {
  const { className, children, ...rest } = props

  return (
    <SegmentGroupPrimitive.Item
      data-slot='segment-group-item'
      className={cn(
        'relative z-10 inline-flex h-full flex-1 cursor-pointer items-center justify-center rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all outline-none select-none',
        'hover:text-foreground',
        'data-focus-visible:border-ring data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50 data-focus-visible:outline-1 data-focus-visible:outline-ring',
        'data-invalid:border-destructive data-invalid:ring-destructive/20',
        'data-checked:text-foreground',
        'dark:text-muted-foreground',
        'dark:hover:text-foreground',
        'dark:data-invalid:ring-destructive/40',
        'dark:data-checked:text-foreground',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        'data-vertical:h-8.5 data-vertical:w-full data-vertical:justify-start data-vertical:px-2.5 data-vertical:py-1.5',
        'group-data-[size=lg]/segment-group:data-vertical:h-9.5 group-data-[size=lg]/segment-group:data-vertical:py-2',
        'group-data-[size=sm]/segment-group:data-vertical:h-7.5 group-data-[size=sm]/segment-group:data-vertical:py-1',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...rest}
    >
      <SegmentGroupPrimitive.ItemText data-slot='segment-group-item-text' className='inline-flex items-center gap-1.5'>
        {children}
      </SegmentGroupPrimitive.ItemText>
      <SegmentGroupPrimitive.ItemHiddenInput />
    </SegmentGroupPrimitive.Item>
  )
}
