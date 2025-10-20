import { cn } from '@repo/ui/utils/cn'
import { cva, type VariantProps } from 'cva'
import { Slot } from 'radix-ui'

const badgeVariants = cva({
  base: [
    'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-[color,box-shadow] overflow-hidden',
    'dark:aria-invalid:ring-destructive/40',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
    '[&>svg]:size-3 [&>svg]:pointer-events-none'
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

type BadgeProps = React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }

const Badge = (props: BadgeProps) => {
  const { className, variant, asChild = false, ...rest } = props
  const Comp = asChild ? Slot.Root : 'span'

  return <Comp data-slot='badge' className={cn(badgeVariants({ variant }), className)} {...rest} />
}

export { Badge, badgeVariants }
