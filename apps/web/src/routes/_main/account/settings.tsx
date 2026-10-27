import { createFileRoute } from '@tanstack/react-router'

import { NotificationSettings } from '@/features/account/notification-settings'
import { createPrivateSeoHead } from '@/lib/seo'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/_main/account/settings')({
  head: () => {
    return createPrivateSeoHead({
      title: m.common_labels_settings(),
      description: m.settings_description(),
      pathname: '/account/settings',
      locale: getLocale(),
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()

  return <NotificationSettings key={user.id} userId={user.id} />
}
