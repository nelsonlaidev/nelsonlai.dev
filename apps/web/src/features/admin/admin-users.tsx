import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

import { UsersTable } from './tables/users'

export function AdminUsers() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const { data, isSuccess, isError, isFetching } = useQuery(
    orpc.admin.user.list.queryOptions({
      input: {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      },
      placeholderData: keepPreviousData,
    }),
  )

  let content: React.ReactNode = (
    <output className='rounded-xl border bg-card p-6 text-muted-foreground'>{m.common_loading()}</output>
  )

  if (isSuccess) {
    content = (
      <UsersTable
        users={data.users}
        pageCount={data.pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isFetching={isFetching}
      />
    )
  } else if (isError) {
    content = (
      <div role='alert' className='rounded-xl border border-destructive/40 bg-card p-6 text-destructive'>
        {m.error_failed_to_fetch_users_data()}
      </div>
    )
  }

  return content
}
