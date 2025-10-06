import { type Locale, useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import AdminComments from '@/components/admin/admin-comments'
import AdminPageHeader from '@/components/admin/admin-page-header'

const Page = (props: PageProps<'/[locale]/admin/comments'>) => {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const t = useTranslations()

  return (
    <div className='space-y-6'>
      <AdminPageHeader title={t('common.labels.comments')} description={t('admin.page-header.comments.description')} />
      <AdminComments />
    </div>
  )
}

export default Page
