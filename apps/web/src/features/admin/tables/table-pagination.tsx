import type { ReactTable, RowData } from '@tanstack/react-table'
import type { features } from './features'

import { Button } from '@repo/ui/components/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/select'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

type TablePaginationProps<TData extends RowData> = {
  table: ReactTable<typeof features, TData>
  disabled?: boolean
}

export function TablePagination<TData extends RowData>(props: TablePaginationProps<TData>) {
  const { table, disabled = false } = props

  return (
    <div className='flex flex-col-reverse items-center justify-between gap-4 px-2 sm:flex-row'>
      <div className='flex-1 text-sm text-muted-foreground'>
        {m.admin_pagination_rows_selected({
          selected: table.getFilteredSelectedRowModel().rows.length,
          total: table.getFilteredRowModel().rows.length,
        })}
      </div>
      <div className='flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
        <div className='flex items-center gap-2'>
          <p className='text-sm font-medium'>{m.admin_pagination_rows_per_page()}</p>
          <Select
            value={`${table.state.pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
            disabled={disabled}
          >
            <SelectTrigger className='min-h-11' aria-label={m.admin_pagination_rows_per_page()}>
              <SelectValue placeholder={table.state.pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top' className='border border-border shadow-md ring-0'>
              {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                <SelectItem className='min-h-11' key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='text-sm font-medium'>
          {m.admin_pagination_page_of({
            page: table.state.pagination.pageIndex + 1,
            total: Math.max(1, table.getPageCount()),
          })}
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => {
              table.setPageIndex(0)
            }}
            className='hidden lg:flex'
            aria-label={m.admin_pagination_go_to_first_page()}
            disabled={!table.getCanPreviousPage() || disabled}
          >
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={() => {
              table.previousPage()
            }}
            aria-label={m.admin_pagination_go_to_previous_page()}
            disabled={!table.getCanPreviousPage() || disabled}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={() => {
              table.nextPage()
            }}
            aria-label={m.admin_pagination_go_to_next_page()}
            disabled={!table.getCanNextPage() || disabled}
          >
            <ChevronRightIcon />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1)
            }}
            className='hidden lg:flex'
            aria-label={m.admin_pagination_go_to_last_page()}
            disabled={!table.getCanNextPage() || disabled}
          >
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
