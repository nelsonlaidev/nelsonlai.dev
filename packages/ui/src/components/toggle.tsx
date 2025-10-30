'use client'

import { cva, type VariantProps } from 'cva'
import { Toggle as TogglePrimitive } from 'radix-ui'

import { cn } from '../utils/cn'

const toggleVariants = cva({
  base: [
    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none',
    'dark:aria-invalid:ring-destructive/40',
    'hover:bg-muted hover:text-muted-foreground',
    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
    'disabled:pointer-events-none disabled:opacity-50',
    'data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    "[&_svg:not([class*='size-'])]:size-4"
  ],
  variants: {
    variant: {
      default: 'bg-transparent',
      outline: 'border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground'
    },
    size: {
      default: 'h-9 min-w-9 px-2',
      sm: 'h-8 min-w-8 px-1.5',
      lg: 'h-10 min-w-10 px-2.5'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
})

type ToggleProps = React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>

const Toggle = (props: ToggleProps) => {
  const { className, variant, size, ...rest } = props

  return (
    <TogglePrimitive.Root data-slot='toggle' className={cn(toggleVariants({ variant, size, className }))} {...rest} />
  )
}

export { Toggle, toggleVariants }
