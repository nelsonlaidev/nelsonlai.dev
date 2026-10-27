import { createFileRoute } from '@tanstack/react-router'

import { AdminComments } from '@/features/admin/admin-comments'
import { AdminPageHeader } from '@/features/admin/admin-page-header'
import { createPrivateSeoHead } from '@/lib/seo'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/admin/comments')({
  head: () =>
    createPrivateSeoHead({
      title: m.common_labels_comments(),
      description: m.admin_page_header_comments_description(),
      pathname: '/admin/comments',
      locale: getLocale(),
    }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='space-y-6'>
      <AdminPageHeader title={m.common_labels_comments()} description={m.admin_page_header_comments_description()} />
      <AdminComments />
    </div>
  )
}
