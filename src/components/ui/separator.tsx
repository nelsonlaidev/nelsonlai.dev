'use client'

import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'

import { cn } from '@/utils/cn'

type SeparatorProps = SeparatorPrimitive.Props

export function Separator(props: SeparatorProps) {
  const { className, orientation = 'horizontal', ...rest } = props

  return (
    <SeparatorPrimitive
      data-slot='separator'
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch',
        className,
      )}
      {...rest}
    />
  )
}
