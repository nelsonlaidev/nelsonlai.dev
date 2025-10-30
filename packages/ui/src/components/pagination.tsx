import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'

import { cn } from '../utils/cn'

import { type Button, buttonVariants } from './button'

type PaginationProps = React.ComponentProps<'nav'>

const Pagination = (props: PaginationProps) => {
  const { className, ...rest } = props

  return (
    <nav
      role='navigation'
      aria-label='pagination'
      data-slot='pagination'
      className={cn('mx-auto flex w-full justify-center', className)}
      {...rest}
    />
  )
}

type PaginationContentProps = React.ComponentProps<'ul'>

const PaginationContent = (props: PaginationContentProps) => {
  const { className, ...rest } = props

  return <ul data-slot='pagination-content' className={cn('flex flex-row items-center gap-1', className)} {...rest} />
}

type PaginationItemProps = React.ComponentProps<'li'>

const PaginationItem = (props: PaginationItemProps) => {
  return <li data-slot='pagination-item' {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>

const PaginationLink = (props: PaginationLinkProps) => {
  const { className, isActive, size = 'icon', ...rest } = props

  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot='pagination-link'
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size
        }),
        className
      )}
      {...rest}
    />
  )
}

type PaginationPreviousProps = React.ComponentProps<typeof PaginationLink>

const PaginationPrevious = (props: PaginationPreviousProps) => {
  const { className, ...rest } = props

  return (
    <PaginationLink
      aria-label='Go to previous page'
      size='default'
      className={cn('gap-1 px-2.5', 'sm:pl-2.5', className)}
      {...rest}
    >
      <ChevronLeftIcon />
      <span className={cn('hidden', 'sm:block')}>Previous</span>
    </PaginationLink>
  )
}

type PaginationNextProps = React.ComponentProps<typeof PaginationLink>

const PaginationNext = (props: PaginationNextProps) => {
  const { className, ...rest } = props

  return (
    <PaginationLink
      aria-label='Go to next page'
      size='default'
      className={cn('gap-1 px-2.5', 'sm:pr-2.5', className)}
      {...rest}
    >
      <span className={cn('hidden', 'sm:block')}>Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

type PaginationEllipsisProps = React.ComponentProps<'span'>

const PaginationEllipsis = (props: PaginationEllipsisProps) => {
  const { className, ...rest } = props

  return (
    <span
      aria-hidden
      data-slot='pagination-ellipsis'
      className={cn('flex size-9 items-center justify-center', className)}
      {...rest}
    >
      <MoreHorizontalIcon className='size-4' />
      <span className='sr-only'>More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
}
