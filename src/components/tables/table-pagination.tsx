'use client'

import type { Table } from '@tanstack/react-table'

import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

type TablePaginationProps<TData> = {
  table: Table<TData>
  disabled?: boolean
}

export function TablePagination<TData>(props: TablePaginationProps<TData>) {
  const { table, disabled = false } = props
  const t = useTranslations()

  return (
    <div className='flex flex-col-reverse items-center justify-between gap-4 px-2 sm:flex-row'>
      <div className='flex-1 text-sm text-muted-foreground'>
        {t('components.table-pagination.rows-selected', {
          selected: table.getFilteredSelectedRowModel().rows.length,
          total: table.getFilteredRowModel().rows.length,
        })}
      </div>
      <div className='flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
        <div className='flex items-center gap-2'>
          <p className='text-sm font-medium'>{t('components.table-pagination.rows-per-page')}</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
            disabled={disabled}
          >
            <SelectTrigger size='sm'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='text-sm font-medium'>
          {t('components.table-pagination.page-of', {
            page: table.getState().pagination.pageIndex + 1,
            total: table.getPageCount(),
          })}
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='icon-sm'
            onClick={() => {
              table.setPageIndex(0)
            }}
            className='hidden lg:flex'
            aria-label={t('components.table-pagination.go-to-first-page')}
            disabled={!table.getCanPreviousPage() || disabled}
          >
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant='outline'
            size='icon-sm'
            onClick={() => {
              table.previousPage()
            }}
            aria-label={t('components.table-pagination.go-to-previous-page')}
            disabled={!table.getCanPreviousPage() || disabled}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant='outline'
            size='icon-sm'
            onClick={() => {
              table.nextPage()
            }}
            aria-label={t('components.table-pagination.go-to-next-page')}
            disabled={!table.getCanNextPage() || disabled}
          >
            <ChevronRightIcon />
          </Button>
          <Button
            variant='outline'
            size='icon-sm'
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1)
            }}
            className='hidden lg:flex'
            aria-label={t('components.table-pagination.go-to-last-page')}
            disabled={!table.getCanNextPage() || disabled}
          >
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
