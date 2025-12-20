import { getTranslations } from 'next-intl/server'

import AdminComments from '@/components/admin/admin-comments'
import AdminPageHeader from '@/components/admin/admin-page-header'

async function Page() {
  const t = await getTranslations()

  return (
    <div className='space-y-6'>
      <AdminPageHeader title={t('common.labels.comments')} description={t('admin.page-header.comments.description')} />
      <AdminComments />
    </div>
  )
}

export default Page
