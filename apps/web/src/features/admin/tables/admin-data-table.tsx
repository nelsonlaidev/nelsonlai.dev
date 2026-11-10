import type { ReactTable, RowData } from '@tanstack/react-table'
import type { features } from './features'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/table'
import { flexRender } from '@tanstack/react-table'

import { TablePagination } from './table-pagination'

type AdminDataTableProps<TData extends RowData> = {
  table: ReactTable<typeof features, TData>
  label: string
  emptyMessage: string
  isFetching?: boolean
}

export function AdminDataTable<TData extends RowData>(props: AdminDataTableProps<TData>) {
  const { table, label, emptyMessage, isFetching = false } = props

  return (
    <div className='flex min-w-0 flex-col gap-5' aria-busy={isFetching}>
      <Table aria-label={label}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow data-state='empty'>
              <TableCell colSpan={table.getAllLeafColumns().length} className='h-24 text-center'>
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination table={table} disabled={isFetching} />
    </div>
  )
}
