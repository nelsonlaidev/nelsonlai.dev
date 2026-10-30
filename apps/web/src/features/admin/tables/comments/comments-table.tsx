import type { OnChangeFn, PaginationState } from '@tanstack/react-table'
import type { Comment } from './columns'

import { useTable } from '@tanstack/react-table'

import { m } from '@/paraglide/messages'

import { AdminDataTable } from '../admin-data-table'
import { features } from '../features'
import { getColumns } from './columns'

type CommentsTableProps = {
  comments: Comment[]
  pageCount: number
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  isFetching?: boolean
}

export function CommentsTable(props: CommentsTableProps) {
  const { comments, pageCount, pagination, onPaginationChange, isFetching = false } = props
  const columns = getColumns()

  const table = useTable({
    features,
    data: comments,
    columns,
    pageCount,
    state: { pagination },
    onPaginationChange,
    manualPagination: true,
  })

  return (
    <AdminDataTable
      table={table}
      label={m.common_labels_comments()}
      emptyMessage={m.components_tables_comments_empty()}
      isFetching={isFetching}
    />
  )
}
