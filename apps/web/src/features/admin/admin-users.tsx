import { createRange } from '@repo/utils'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Skeleton } from 'skullet/react'

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
  const { data, isError, isFetching, isPending } = useQuery(
    orpc.admin.user.list.queryOptions({
      input: {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      },
      placeholderData: keepPreviousData,
    }),
  )

  if (isError) {
    return (
      <div role='alert' className='text-sm text-destructive'>
        {m.error_failed_to_fetch_users_data()}
      </div>
    )
  }

  return (
    <>
      {isPending && <output className='sr-only'>{m.common_aria_labels_loading()}</output>}
      <Skeleton data={data?.users} sample={SAMPLE_USERS}>
        {(users) => (
          <UsersTable
            users={users}
            pageCount={data?.pageCount ?? 1}
            pagination={pagination}
            onPaginationChange={setPagination}
            isFetching={isFetching}
          />
        )}
      </Skeleton>
    </>
  )
}
