'use client'

import { useTranslations } from 'next-intl'

import { useListAdminComments } from '@/hooks/queries/admin.query'

import CommentsTable from '../tables/comments'

function AdminComments() {
  const { data, isSuccess, isLoading, isError } = useListAdminComments()
  const t = useTranslations()

  return (
    <>
      {isSuccess && <CommentsTable comments={data.comments} />}
      {isLoading && 'Loading...'}
      {isError && <div>{t('error.failed-to-fetch-comments-data')}</div>}
    </>
  )
}

export default AdminComments
