import { getTranslations } from 'next-intl/server'

import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { AdminPageHeader } from '@/components/admin/admin-page-header'

async function Page() {
  const t = await getTranslations()

  return (
    <div className='space-y-6'>
      <AdminPageHeader title={t('common.labels.dashboard')} description={t('admin.dashboard.description')} />
      <AdminDashboard />
    </div>
  )
}

export default Page
