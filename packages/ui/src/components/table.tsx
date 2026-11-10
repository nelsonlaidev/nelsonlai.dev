import { cn } from 'cn'
import { useId } from 'react'

type TableProps = React.ComponentProps<'table'> & {
  caption?: string
}

export function Table(props: TableProps) {
  const { caption, className, ...rest } = props
  const captionId = useId()

  const card = (
    <div
      data-slot='table-container'
      className='relative w-full overflow-x-auto overscroll-x-contain rounded-xl border bg-card'
    >
      <table
        data-slot='table'
        aria-labelledby={caption && !rest['aria-label'] ? captionId : undefined}
        className={cn('w-full caption-bottom text-sm', className)}
        {...rest}
      />
    </div>
  )

  if (!caption) return card

  return (
    <figure className='min-w-0'>
      {card}
      <figcaption id={captionId} data-slot='table-caption' className='mt-4 text-center text-sm text-muted-foreground'>
        {caption}
      </figcaption>
    </figure>
  )
}

type TableHeaderProps = React.ComponentProps<'thead'>

export function TableHeader(props: TableHeaderProps) {
  const { className, ...rest } = props

  return <thead data-slot='table-header' className={cn('[&_tr]:border-b', className)} {...rest} />
}

type TableBodyProps = React.ComponentProps<'tbody'>

export function TableBody(props: TableBodyProps) {
  const { className, ...rest } = props

  return <tbody data-slot='table-body' className={cn('[&_tr:last-child]:border-0', className)} {...rest} />
}

type TableFooterProps = React.ComponentProps<'tfoot'>

export function TableFooter(props: TableFooterProps) {
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

export function TableRow(props: TableRowProps) {
  const { className, ...rest } = props

  return (
    <tr
      data-slot='table-row'
      className={cn(
        'border-b transition-colors ease-linear in-[tbody]:not-data-[state=empty]:hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted motion-reduce:transition-none',
        className,
      )}
      {...rest}
    />
  )
}

type TableHeadProps = React.ComponentProps<'th'>

export function TableHead(props: TableHeadProps) {
  const { className, ...rest } = props

  return (
    <th
      data-slot='table-head'
      className={cn(
        'h-10 bg-surface px-3 text-left align-middle font-medium whitespace-nowrap text-muted-foreground has-[[role=checkbox]]:pr-0 sm:px-4',
        className,
      )}
      {...rest}
    />
  )
}

type TableCellProps = React.ComponentProps<'td'>

export function TableCell(props: TableCellProps) {
  const { className, ...rest } = props

  return (
    <td
      data-slot='table-cell'
      className={cn(
        'max-w-md min-w-36 px-3 py-4 align-middle leading-relaxed wrap-anywhere has-[[role=checkbox]]:pr-0 sm:px-4',
        className,
      )}
      {...rest}
    />
  )
}

type TableCaptionProps = React.ComponentProps<'caption'>

export function TableCaption(props: TableCaptionProps) {
  const { className, ...rest } = props

  return <caption data-slot='table-caption' className={cn('mt-4 text-sm text-muted-foreground', className)} {...rest} />
}
