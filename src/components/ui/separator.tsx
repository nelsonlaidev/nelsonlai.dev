'use client'

import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'

import { cn } from '@/utils/cn'

type SeparatorProps = SeparatorPrimitive.Props

function Separator(props: SeparatorProps) {
  const { className, orientation = 'horizontal', ...rest } = props

  return (
    <SeparatorPrimitive
      data-slot='separator'
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch',
        className,
      )}
      {...rest}
    />
  )
}

export { Separator }
