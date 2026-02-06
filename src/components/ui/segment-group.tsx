import { SegmentGroup as SegmentGroupPrimitive } from '@ark-ui/react/segment-group'

import { cn } from '@/utils/cn'

type SegmentGroupProps = React.ComponentProps<typeof SegmentGroupPrimitive.Root>

function SegmentGroup(props: SegmentGroupProps) {
  const { className, children, orientation = 'horizontal', ...rest } = props

  return (
    <SegmentGroupPrimitive.Root
      data-slot='segment-group'
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        'flex items-start data-horizontal:gap-4 data-horizontal:border-b data-vertical:flex-col data-vertical:gap-1 data-vertical:border-l',
        className,
      )}
      {...rest}
    >
      <SegmentGroupPrimitive.Indicator
        data-slot='segment-group-indicator'
        className={cn(
          'border-foreground data-horizontal:bottom-0 data-horizontal:w-(--width) data-horizontal:translate-y-px data-horizontal:border-b-2 data-vertical:h-(--height) data-vertical:-translate-x-px data-vertical:border-l-2',
          className,
        )}
      />
      {children}
    </SegmentGroupPrimitive.Root>
  )
}

type SegmentGroupItemProps = React.ComponentProps<typeof SegmentGroupPrimitive.Item>

function SegmentGroupItem(props: SegmentGroupItemProps) {
  const { className, children, ...rest } = props

  return (
    <SegmentGroupPrimitive.Item
      data-slot='segment-group-item'
      className={cn(
        'cursor-pointer font-medium text-muted-foreground transition-colors hover:text-accent-foreground data-checked:text-foreground data-disabled:cursor-not-allowed data-disabled:text-muted-foreground data-disabled:opacity-50 data-horizontal:px-1 data-horizontal:pb-3 data-vertical:px-3 data-vertical:py-1.5',
        className,
      )}
      {...rest}
    >
      <SegmentGroupPrimitive.ItemText>{children}</SegmentGroupPrimitive.ItemText>
      <SegmentGroupPrimitive.ItemControl />
      <SegmentGroupPrimitive.ItemHiddenInput />
    </SegmentGroupPrimitive.Item>
  )
}

export { SegmentGroup, SegmentGroupItem }
