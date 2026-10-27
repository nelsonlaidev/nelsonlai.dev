import type { OnChangeFn, PaginationState } from '@tanstack/react-table'
import type { User } from './columns'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/table'
import { flexRender, useTable } from '@tanstack/react-table'

import { m } from '@/paraglide/messages'

import { features } from '../features'
import { TablePagination } from '../table-pagination'
import { getColumns } from './columns'

type UsersTableProps = {
  users: User[]
  pageCount: number
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  isFetching?: boolean
}

export function UsersTable(props: UsersTableProps) {
  const { users, pageCount, pagination, onPaginationChange, isFetching = false } = props
  const columns = getColumns()

  const table = useTable({
    features,
    data: users,
    columns,
    pageCount,
    state: { pagination },
    onPaginationChange,
    manualPagination: true,
  })

  return (
    <div className='flex flex-col gap-4'>
      <div className='overflow-hidden rounded-md border'>
        <Table>
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
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  {m.components_tables_users_empty()}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} disabled={isFetching} />
    </div>
  )
}
