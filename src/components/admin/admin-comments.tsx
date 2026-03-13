'use client'

import type { PaginationState } from '@tanstack/react-table'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { useListCommentsAdmin } from '@/hooks/queries/admin.query'

import { CommentsTable } from '../tables/comments'

export function AdminComments() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const { data, isSuccess, isLoading, isError, isFetching } = useListCommentsAdmin({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  })
  const t = useTranslations()

  return (
    <>
      {isSuccess && (
        <CommentsTable
          comments={data.comments}
          pageCount={data.pageCount}
          pagination={pagination}
          onPaginationChange={setPagination}
          isFetching={isFetching}
        />
      )}
      {isLoading && <div>{t('common.loading')}</div>}
      {isError && <div>{t('error.failed-to-fetch-comments-data')}</div>}
    </>
  )
}
