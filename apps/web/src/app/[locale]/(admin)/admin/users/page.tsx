import { type Locale, useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminUsers from '@/components/admin/admin-users'

const Page = (props: PageProps<'/[locale]/admin/users'>) => {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const t = useTranslations()

  return (
    <div className='space-y-6'>
      <AdminPageHeader title={t('common.labels.users')} description={t('admin.page-header.users.description')} />
      <AdminUsers />
    </div>
  )
}

export default Page
