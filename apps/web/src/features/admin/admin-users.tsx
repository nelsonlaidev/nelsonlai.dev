import { createRange } from '@repo/utils'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Skeleton } from 'skullet/react'

import { LoadingStatus } from '@/components/loading-status'
import { QueryErrorMessage } from '@/components/query-error-message'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

import { UsersTable } from './tables/users'

const SAMPLE_USERS = createRange(10).map((index) => ({
  id: String(index),
  name: 'Ocean visitor',
  email: 'visitor@example.com',
  role: 'user',
  image: '/images/avatar.png',
  createdAt: new Date('2026-01-01T12:00:00Z'),
}))

export function AdminUsers() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const query = useQuery(
    orpc.admin.user.list.queryOptions({
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
        role='alert'
        query={query}
        message={m.error_failed_to_fetch_users_data()}
        className='text-sm text-destructive'
      />
    )
  }

  return (
    <>
      {query.isPending && <LoadingStatus />}
      <Skeleton data={query.data?.users} sample={SAMPLE_USERS}>
        {(users) => (
          <UsersTable
            users={users}
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
