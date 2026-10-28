import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

import { CommentsTable } from './tables/comments'

export function AdminComments() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const { data, isSuccess, isError, isFetching } = useQuery(
    orpc.admin.comment.list.queryOptions({
      input: {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      },
      placeholderData: keepPreviousData,
    }),
  )

  let content: React.ReactNode = <div>{m.common_loading()}</div>

  if (isSuccess) {
    content = (
      <CommentsTable
        comments={data.comments}
        pageCount={data.pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isFetching={isFetching}
      />
    )
  } else if (isError) {
    content = <div>{m.error_failed_to_fetch_comments_data()}</div>
  }

  return content
}
