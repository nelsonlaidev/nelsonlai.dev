import { cva, type VariantProps } from 'cva'

import { cn } from '../utils/cn'

type EmptyProps = React.ComponentProps<'div'>

const Empty = (props: EmptyProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='empty'
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance',
        'md:p-12',
        className
      )}
      {...rest}
    />
  )
}

type EmptyHeaderProps = React.ComponentProps<'div'>

const EmptyHeader = (props: EmptyHeaderProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='empty-header'
      className={cn('flex max-w-sm flex-col items-center gap-2 text-center', className)}
      {...rest}
    />
  )
}

const emptyMediaVariants = cva({
  base: ['mb-2 flex shrink-0 items-center justify-center', '[&_svg]:pointer-events-none [&_svg]:shrink-0'],
  variants: {
    variant: {
      default: 'bg-transparent',
      icon: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-6"
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

type EmptyMediaProps = React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>

const EmptyMedia = (props: EmptyMediaProps) => {
  const { className, variant = 'default', ...rest } = props

  return (
    <div
      data-slot='empty-icon'
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...rest}
    />
  )
}

type EmptyTitleProps = React.ComponentProps<'div'>

const EmptyTitle = (props: EmptyTitleProps) => {
  const { className, ...rest } = props

  return <div data-slot='empty-title' className={cn('text-lg font-medium tracking-tight', className)} {...rest} />
}

type EmptyDescriptionProps = React.ComponentProps<'p'>

const EmptyDescription = (props: EmptyDescriptionProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='empty-description'
      className={cn(
        'text-sm/relaxed text-muted-foreground',
        '[&>a:hover]:text-primary',
        '[&>a]:underline [&>a]:underline-offset-4',
        className
      )}
      {...rest}
    />
  )
}

type EmptyContentProps = React.ComponentProps<'div'>

const EmptyContent = (props: EmptyContentProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='empty-content'
      className={cn('flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance', className)}
      {...rest}
    />
  )
}

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle }
