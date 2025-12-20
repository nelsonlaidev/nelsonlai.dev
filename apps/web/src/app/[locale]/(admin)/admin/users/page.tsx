import { getTranslations } from 'next-intl/server'

import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminUsers from '@/components/admin/admin-users'

async function Page() {
  const t = await getTranslations()

  return (
    <div className='space-y-6'>
      <AdminPageHeader title={t('common.labels.users')} description={t('admin.page-header.users.description')} />
      <AdminUsers />
    </div>
  )
}

export default Page
