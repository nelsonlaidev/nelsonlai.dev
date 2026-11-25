import { createRange } from '@repo/utils'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Skeleton } from 'skullet/react'

import { QueryErrorMessage } from '@/components/query-error-message'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

import { CommentsTable } from './tables/comments'

const SAMPLE_COMMENTS = createRange(10).map((index) => ({
  id: String(index),
  body: 'A thought about this article.',
  postSlug: 'example-post',
  parentId: null,
  userId: 'sample',
  isDeleted: false,
  createdAt: new Date('2026-01-01T12:00:00Z'),
  updatedAt: new Date('2026-01-01T12:00:00Z'),
  user: { id: 'sample', name: 'Ocean visitor', image: '/images/avatar.png' },
}))

export function AdminComments() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const query = useQuery(
    orpc.admin.comment.list.queryOptions({
      input: {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      },
      placeholderData: keepPreviousData,
    }),
  )

  if (query.isLoadingError) {
    return (
      <QueryErrorMessage
        query={query}
        message={m.error_failed_to_fetch_comments_data()}
        className='rounded-xl border border-destructive/40 bg-card p-6 text-destructive'
      />
    )
  }

  return (
    <>
      {query.isPending && <output className='sr-only'>{m.common_aria_labels_loading()}</output>}
      <Skeleton data={query.data?.comments} sample={SAMPLE_COMMENTS}>
        {(comments) => (
          <CommentsTable
            comments={comments}
            pageCount={query.data?.pageCount ?? 1}
            pagination={pagination}
            onPaginationChange={setPagination}
            isFetching={query.isFetching}
          />
        )}
      </Skeleton>
    </>
  )
}
