'use client'

import { useTranslations } from 'next-intl'

import { useListCommentsAdmin } from '@/hooks/queries/admin.query'

import CommentsTable from '../tables/comments'

function AdminComments() {
  const { data, isSuccess, isLoading, isError } = useListCommentsAdmin()
  const t = useTranslations()

  return (
    <>
      {isSuccess && <CommentsTable comments={data.comments} />}
      {isLoading && <div>{t('common.loading')}</div>}
      {isError && <div>{t('error.failed-to-fetch-comments-data')}</div>}
    </>
  )
}

export default AdminComments
