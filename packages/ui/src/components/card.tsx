import { cn } from '../utils/cn'

type CardProps = React.ComponentProps<'div'>

const Card = (props: CardProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='card'
      className={cn('flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm', className)}
      {...rest}
    />
  )
}

type CardHeaderProps = React.ComponentProps<'div'>

const CardHeader = (props: CardHeaderProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='card-header'
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6',
        'has-data-[slot=card-action]:grid-cols-[1fr_auto]',
        '[.border-b]:pb-6',
        className
      )}
      {...rest}
    />
  )
}

type CardTitleProps = React.ComponentProps<'div'>

const CardTitle = (props: CardTitleProps) => {
  const { className, ...rest } = props

  return <div data-slot='card-title' className={cn('leading-none font-semibold', className)} {...rest} />
}

type CardDescriptionProps = React.ComponentProps<'div'>

const CardDescription = (props: CardDescriptionProps) => {
  const { className, ...rest } = props

  return <div data-slot='card-description' className={cn('text-sm text-muted-foreground', className)} {...rest} />
}

type CardActionProps = React.ComponentProps<'div'>

const CardAction = (props: CardActionProps) => {
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

const CardContent = (props: CardContentProps) => {
  const { className, ...rest } = props

  return <div data-slot='card-content' className={cn('px-6', className)} {...rest} />
}

type CardFooterProps = React.ComponentProps<'div'>

const CardFooter = (props: CardFooterProps) => {
  const { className, ...rest } = props

  return (
    <div data-slot='card-footer' className={cn('flex items-center px-6', '[.border-t]:pt-6', className)} {...rest} />
  )
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
