import type { OnChangeFn, PaginationState } from '@tanstack/react-table'
import type { User } from './columns'

import { useTable } from '@tanstack/react-table'

import { m } from '@/paraglide/messages'

import { AdminDataTable } from '../admin-data-table'
import { features } from '../features'
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
    <AdminDataTable
      table={table}
      label={m.common_labels_users()}
      emptyMessage={m.components_tables_users_empty()}
      isFetching={isFetching}
    />
  )
}
