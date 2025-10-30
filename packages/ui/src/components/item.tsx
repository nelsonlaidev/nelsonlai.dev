import { cva, type VariantProps } from 'cva'
import { Slot } from 'radix-ui'

import { cn } from '../utils/cn'

import { Separator } from './separator'

type ItemGroupProps = React.ComponentProps<'div'>

const ItemGroup = (props: ItemGroupProps) => {
  const { className, ...rest } = props

  return (
    <div role='list' data-slot='item-group' className={cn('group/item-group flex flex-col', className)} {...rest} />
  )
}

type ItemSeparatorProps = React.ComponentProps<typeof Separator>

const ItemSeparator = (props: ItemSeparatorProps) => {
  const { className, ...rest } = props

  return <Separator data-slot='item-separator' orientation='horizontal' className={cn('my-0', className)} {...rest} />
}

const itemVariants = cva({
  base: [
    'group/item flex flex-wrap items-center rounded-md border border-transparent text-sm transition-colors duration-100 outline-none',
    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
    '[a]:transition-colors [a]:hover:bg-accent/50'
  ],
  variants: {
    variant: {
      default: 'bg-transparent',
      outline: 'border-border',
      muted: 'bg-muted/50'
    },
    size: {
      default: 'gap-4 p-4',
      sm: 'gap-2.5 px-4 py-3'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
})

type ItemProps = React.ComponentProps<'div'> & VariantProps<typeof itemVariants> & { asChild?: boolean }

const Item = (props: ItemProps) => {
  const { className, variant = 'default', size = 'default', asChild = false, ...rest } = props
  const Comp = asChild ? Slot.Root : 'div'
  return (
    <Comp
      data-slot='item'
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, className }))}
      {...rest}
    />
  )
}

const itemMediaVariants = cva({
  base: [
    'flex shrink-0 items-center justify-center gap-2',
    '[&_svg]:pointer-events-none',
    'group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start'
  ],
  variants: {
    variant: {
      default: 'bg-transparent',
      icon: "size-8 rounded-sm border bg-muted [&_svg:not([class*='size-'])]:size-4",
      image: 'size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

type ItemMediaProps = React.ComponentProps<'div'> & VariantProps<typeof itemMediaVariants>

const ItemMedia = (props: ItemMediaProps) => {
  const { className, variant = 'default', ...rest } = props

  return (
    <div
      data-slot='item-media'
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...rest}
    />
  )
}

type ItemContentProps = React.ComponentProps<'div'>

const ItemContent = (props: ItemContentProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='item-content'
      className={cn('flex flex-1 flex-col gap-1', '[&+[data-slot=item-content]]:flex-none', className)}
      {...rest}
    />
  )
}

type ItemTitleProps = React.ComponentProps<'div'>

const ItemTitle = (props: ItemTitleProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='item-title'
      className={cn('flex w-fit items-center gap-2 text-sm leading-snug font-medium', className)}
      {...rest}
    />
  )
}

type ItemDescriptionProps = React.ComponentProps<'p'>

const ItemDescription = (props: ItemDescriptionProps) => {
  const { className, ...rest } = props

  return (
    <p
      data-slot='item-description'
      className={cn(
        'line-clamp-2 text-sm leading-normal font-normal text-balance text-muted-foreground',
        '[&>a:hover]:text-primary',
        '[&>a]:underline [&>a]:underline-offset-4',
        className
      )}
      {...rest}
    />
  )
}

type ItemActionsProps = React.ComponentProps<'div'>

const ItemActions = (props: ItemActionsProps) => {
  const { className, ...rest } = props

  return <div data-slot='item-actions' className={cn('flex items-center gap-2', className)} {...rest} />
}

type ItemHeaderProps = React.ComponentProps<'div'>

const ItemHeader = (props: ItemHeaderProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='item-header'
      className={cn('flex basis-full items-center justify-between gap-2', className)}
      {...rest}
    />
  )
}

type ItemFooterProps = React.ComponentProps<'div'>

const ItemFooter = (props: ItemFooterProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='item-footer'
      className={cn('flex basis-full items-center justify-between gap-2', className)}
      {...rest}
    />
  )
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle
}
