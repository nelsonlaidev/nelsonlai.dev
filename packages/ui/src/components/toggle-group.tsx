'use client'

import type { VariantProps } from 'cva'

import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui'
import { createContext, use, useMemo } from 'react'

import { cn } from '../utils/cn'

import { toggleVariants } from './toggle'

const ToggleGroupContext = createContext<VariantProps<typeof toggleVariants>>({
  size: 'default',
  variant: 'default'
})
ToggleGroupContext.displayName = 'ToggleGroupContext'

type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>

const ToggleGroup = (props: ToggleGroupProps) => {
  const { className, variant, size, children, ...rest } = props

  const value = useMemo(
    () => ({
      variant,
      size
    }),
    [variant, size]
  )

  return (
    <ToggleGroupPrimitive.Root
      data-slot='toggle-group'
      data-variant={variant}
      data-size={size}
      className={cn(
        'group/toggle-group flex w-fit items-center rounded-md',
        'data-[variant=outline]:shadow-xs',
        className
      )}
      {...rest}
    >
      <ToggleGroupContext value={value}>{children}</ToggleGroupContext>
    </ToggleGroupPrimitive.Root>
  )
}

type ToggleGroupItemProps = React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>

const ToggleGroupItem = (props: ToggleGroupItemProps) => {
  const { className, children, variant, size, ...rest } = props
  const context = use(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot='toggle-group-item'
      data-variant={context.variant ?? variant}
      data-size={context.size ?? size}
      className={cn(
        'min-w-0 flex-1 shrink-0 rounded-none shadow-none',
        'focus:z-10',
        'focus-visible:z-10',
        'first:rounded-l-md',
        'last:rounded-r-md',
        'data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l',
        toggleVariants({
          variant: context.variant ?? variant,
          size: context.size ?? size
        }),
        className
      )}
      {...rest}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
