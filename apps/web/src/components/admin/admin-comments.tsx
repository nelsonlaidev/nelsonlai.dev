'use client'

import { useTranslations } from 'next-intl'

import { useAdminComments } from '@/hooks/queries/admin.query'

import CommentsTable from '../tables/comments'

const AdminComments = () => {
  const { isSuccess, isLoading, isError, data } = useAdminComments()
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
