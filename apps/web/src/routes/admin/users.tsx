import { createFileRoute } from '@tanstack/react-router'

import { AdminPageHeader } from '@/features/admin/admin-page-header'
import { AdminUsers } from '@/features/admin/admin-users'
import { createPrivateSeoHead } from '@/lib/seo'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/admin/users')({
  head: () =>
    createPrivateSeoHead({
      title: m.common_labels_users(),
      description: m.admin_page_header_users_description(),
      pathname: '/admin/users',
      locale: getLocale(),
    }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='space-y-6'>
      <AdminPageHeader title={m.common_labels_users()} description={m.admin_page_header_users_description()} />
      <AdminUsers />
    </div>
  )
}
