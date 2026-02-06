'use client'

import { cn } from '@/utils/cn'

type TableProps = React.ComponentProps<'table'>

function Table(props: TableProps) {
  const { className, ...rest } = props

  return (
    <div data-slot='table-container' className='relative w-full overflow-x-auto'>
      {/* eslint-disable-next-line sonarjs/table-header -- Table is a reusable wrapper component. Header rows and columns are provided at the usage site via TableHeader and TableHead components. */}
      <table data-slot='table' className={cn('w-full caption-bottom text-sm', className)} {...rest} />
    </div>
  )
}

type TableHeaderProps = React.ComponentProps<'thead'>

function TableHeader(props: TableHeaderProps) {
  const { className, ...rest } = props

  return <thead data-slot='table-header' className={cn('[&_tr]:border-b', className)} {...rest} />
}

type TableBodyProps = React.ComponentProps<'tbody'>

function TableBody(props: TableBodyProps) {
  const { className, ...rest } = props

  return <tbody data-slot='table-body' className={cn('[&_tr:last-child]:border-0', className)} {...rest} />
}

type TableFooterProps = React.ComponentProps<'tfoot'>

function TableFooter(props: TableFooterProps) {
  const { className, ...rest } = props

  return (
    <tfoot
      data-slot='table-footer'
      className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
      {...rest}
    />
  )
}

type TableRowProps = React.ComponentProps<'tr'>

function TableRow(props: TableRowProps) {
  const { className, ...rest } = props

  return (
    <tr
      data-slot='table-row'
      className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
      {...rest}
    />
  )
}

type TableHeadProps = React.ComponentProps<'th'>

function TableHead(props: TableHeadProps) {
  const { className, ...rest } = props

  return (
    <th
      data-slot='table-head'
      className={cn(
        'h-12 px-3 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...rest}
    />
  )
}

type TableCellProps = React.ComponentProps<'td'>

function TableCell(props: TableCellProps) {
  const { className, ...rest } = props

  return (
    <td
      data-slot='table-cell'
      className={cn('p-3 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0', className)}
      {...rest}
    />
  )
}

type TableCaptionProps = React.ComponentProps<'caption'>

function TableCaption(props: TableCaptionProps) {
  const { className, ...rest } = props

  return <caption data-slot='table-caption' className={cn('mt-4 text-sm text-muted-foreground', className)} {...rest} />
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow }
