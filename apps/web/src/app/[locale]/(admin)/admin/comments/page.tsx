import { routing } from '@repo/i18n/routing'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import AdminComments from '@/components/admin/admin-comments'
import AdminPageHeader from '@/components/admin/admin-page-header'

const Page = async (props: PageProps<'/[locale]/admin/comments'>) => {
  const { params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const t = await getTranslations()

  return (
    <div className='space-y-6'>
      <AdminPageHeader title={t('common.labels.comments')} description={t('admin.page-header.comments.description')} />
      <AdminComments />
    </div>
  )
}

export default Page
