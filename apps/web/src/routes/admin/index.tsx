import { createFileRoute } from '@tanstack/react-router'

import { AdminDashboard } from '@/features/admin/admin-dashboard'
import { AdminPageHeader } from '@/features/admin/admin-page-header'
import { createPrivateSeoHead } from '@/lib/seo'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/admin/')({
  head: () =>
    createPrivateSeoHead({
      title: m.common_labels_dashboard(),
      description: m.admin_dashboard_description(),
      pathname: '/admin',
      locale: getLocale(),
    }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='space-y-6'>
      <AdminPageHeader title={m.common_labels_dashboard()} description={m.admin_dashboard_description()} />
      <AdminDashboard />
    </div>
  )
}
