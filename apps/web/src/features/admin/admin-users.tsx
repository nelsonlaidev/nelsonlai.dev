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
  const { data, isSuccess, isLoading, isError, isFetching } = useQuery(
    orpc.admin.user.list.queryOptions({
      input: {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      },
      placeholderData: keepPreviousData,
    }),
  )

  return (
    <>
      {isSuccess && (
        <UsersTable
          users={data.users}
          pageCount={data.pageCount}
          pagination={pagination}
          onPaginationChange={setPagination}
          isFetching={isFetching}
        />
      )}
      {isLoading && <div>{m.common_loading()}</div>}
      {isError && <div>{m.error_failed_to_fetch_users_data()}</div>}
    </>
  )
}
