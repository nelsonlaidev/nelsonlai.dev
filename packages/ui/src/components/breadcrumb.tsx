import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { Slot } from 'radix-ui'

import { cn } from '../utils/cn'

type BreadcrumbProps = React.ComponentProps<'nav'>

function Breadcrumb(props: BreadcrumbProps) {
  return <nav aria-label='breadcrumb' data-slot='breadcrumb' {...props} />
}

type BreadcrumbListProps = React.ComponentProps<'ol'>

function BreadcrumbList(props: BreadcrumbListProps) {
  const { className, ...rest } = props

  return (
    <ol
      data-slot='breadcrumb-list'
      className={cn(
        'flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground',
        'sm:gap-2.5',
        className
      )}
      {...rest}
    />
  )
}

type BreadcrumbItemProps = React.ComponentProps<'li'>

function BreadcrumbItem(props: BreadcrumbItemProps) {
  const { className, ...rest } = props

  return <li data-slot='breadcrumb-item' className={cn('inline-flex items-center gap-1.5', className)} {...rest} />
}

type BreadcrumbLinkProps = React.ComponentProps<'a'> & {
  asChild?: boolean
}

function BreadcrumbLink(props: BreadcrumbLinkProps) {
  const { asChild, className, ...rest } = props
  const Comp = asChild ? Slot.Root : 'a'

  return (
    <Comp
      data-slot='breadcrumb-link'
      className={cn('transition-colors', 'hover:text-foreground', className)}
      {...rest}
    />
  )
}

type BreadcrumbPageProps = React.ComponentProps<'span'>

function BreadcrumbPage(props: BreadcrumbPageProps) {
  const { className, ...rest } = props

  return (
    <span
      data-slot='breadcrumb-page'
      role='link'
      aria-disabled='true'
      aria-current='page'
      className={cn('font-normal text-foreground', className)}
      {...rest}
    />
  )
}

type BreadcrumbSeparatorProps = React.ComponentProps<'li'>

function BreadcrumbSeparator(props: BreadcrumbSeparatorProps) {
  const { children, className, ...rest } = props

  return (
    <li
      data-slot='breadcrumb-separator'
      role='presentation'
      aria-hidden='true'
      className={cn('[&>svg]:size-3.5', className)}
      {...rest}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

type BreadcrumbEllipsisProps = React.ComponentProps<'span'>

function BreadcrumbEllipsis(props: BreadcrumbEllipsisProps) {
  const { className, ...rest } = props

  return (
    <span
      data-slot='breadcrumb-ellipsis'
      role='presentation'
      aria-hidden='true'
      className={cn('flex size-9 items-center justify-center', className)}
      {...rest}
    >
      <MoreHorizontal className='size-4' />
      <span className='sr-only'>More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
}
