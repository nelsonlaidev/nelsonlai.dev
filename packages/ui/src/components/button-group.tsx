import { cva, type VariantProps } from 'cva'
import { Slot } from 'radix-ui'

import { cn } from '../utils/cn'

import { Separator } from './separator'

const buttonGroupVariants = cva({
  base: [
    'flex w-fit items-stretch',
    '[&>*]:focus-visible:relative [&>*]:focus-visible:z-10',
    "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit",
    '[&>input]:flex-1',
    'has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md',
    'has-[>[data-slot=button-group]]:gap-2'
  ],
  variants: {
    orientation: {
      horizontal:
        '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none',
      vertical:
        'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none'
    }
  },
  defaultVariants: {
    orientation: 'horizontal'
  }
})

type ButtonGroupProps = React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>

const ButtonGroup = (props: ButtonGroupProps) => {
  const { className, orientation, ...rest } = props

  return (
    <div
      role='group'
      data-slot='button-group'
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...rest}
    />
  )
}

type ButtonGroupTextProps = React.ComponentProps<'div'> & {
  asChild?: boolean
}

const ButtonGroupText = (props: ButtonGroupTextProps) => {
  const { className, asChild = false, ...rest } = props
  const Comp = asChild ? Slot.Root : 'div'

  return (
    <Comp
      className={cn(
        'flex items-center gap-2 rounded-md border bg-muted px-4 text-sm font-medium shadow-xs',
        '[&_svg]:pointer-events-none',
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...rest}
    />
  )
}

type ButtonGroupSeparatorProps = React.ComponentProps<typeof Separator>

const ButtonGroupSeparator = (props: ButtonGroupSeparatorProps) => {
  const { className, orientation = 'vertical', ...rest } = props

  return (
    <Separator
      data-slot='button-group-separator'
      orientation={orientation}
      className={cn('relative m-0! self-stretch bg-input', 'data-[orientation=vertical]:h-auto', className)}
      {...rest}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants }
