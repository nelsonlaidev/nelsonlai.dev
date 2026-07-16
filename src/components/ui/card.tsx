import { cn } from '@/utils/cn'

type CardProps = React.ComponentProps<'div'> & {
  size?: 'default' | 'sm'
}

export function Card(props: CardProps) {
  const { className, size = 'default', ...rest } = props

  return (
    <div
      data-slot='card'
      data-size={size}
      className={cn(
        'group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-2xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(6)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
        className,
      )}
      {...rest}
    />
  )
}

type CardHeaderProps = React.ComponentProps<'div'>

export function CardHeader(props: CardHeaderProps) {
  const { className, ...rest } = props

  return (
    <div
      data-slot='card-header'
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-2 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)',
        className,
      )}
      {...rest}
    />
  )
}

type CardTitleProps = React.ComponentProps<'div'>

export function CardTitle(props: CardTitleProps) {
  const { className, ...rest } = props

  return <div data-slot='card-title' className={cn('font-heading text-base font-medium', className)} {...rest} />
}

type CardDescriptionProps = React.ComponentProps<'div'>

export function CardDescription(props: CardDescriptionProps) {
  const { className, ...rest } = props

  return <div data-slot='card-description' className={cn('text-sm text-muted-foreground', className)} {...rest} />
}

type CardActionProps = React.ComponentProps<'div'>

export function CardAction(props: CardActionProps) {
  const { className, ...rest } = props

  return (
    <div
      data-slot='card-action'
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...rest}
    />
  )
}

type CardContentProps = React.ComponentProps<'div'>

export function CardContent(props: CardContentProps) {
  const { className, ...rest } = props

  return <div data-slot='card-content' className={cn('px-(--card-spacing)', className)} {...rest} />
}

type CardFooterProps = React.ComponentProps<'div'>

export function CardFooter(props: CardFooterProps) {
  const { className, ...rest } = props

  return (
    <div
      data-slot='card-footer'
      className={cn('flex items-center rounded-b-xl px-(--card-spacing) [.border-t]:pt-(--card-spacing)', className)}
      {...rest}
    />
  )
}
