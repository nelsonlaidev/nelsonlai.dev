import { routing } from '@repo/i18n/routing'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminUsers from '@/components/admin/admin-users'

export const generateStaticParams = (): Array<{ locale: string }> => {
  return routing.locales.map((locale) => ({ locale }))
}

const Page = async (props: PageProps<'/[locale]/admin/users'>) => {
  const { params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const t = await getTranslations()

  return (
    <div className='space-y-6'>
      <AdminPageHeader title={t('common.labels.users')} description={t('admin.page-header.users.description')} />
      <AdminUsers />
    </div>
  )
}

export default Page
