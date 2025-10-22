import { cva, type VariantProps } from 'cva'
import { Slot } from 'radix-ui'

import { cn } from '../utils/cn'

const badgeVariants = cva({
  base: [
    'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow]',
    'dark:aria-invalid:ring-destructive/40',
    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
    '[&>svg]:pointer-events-none [&>svg]:size-3'
  ],
  variants: {
    variant: {
      default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
      secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
      destructive:
        'border-transparent bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90',
      outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

type BadgeProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
  }

const Badge = (props: BadgeProps) => {
  const { className, variant, asChild = false, ...rest } = props
  const Comp = asChild ? Slot.Root : 'span'

  return <Comp data-slot='badge' className={cn(badgeVariants({ variant, className }))} {...rest} />
}

export { Badge, badgeVariants }
