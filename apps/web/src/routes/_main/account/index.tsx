import { createFileRoute } from '@tanstack/react-router'

import { ActiveSessions } from '@/features/account/active-sessions'
import { Profile } from '@/features/account/profile'
import { createPrivateSeoHead } from '@/lib/seo'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/_main/account/')({
  head: () => {
    return createPrivateSeoHead({
      title: m.common_labels_account(),
      description: m.account_description(),
      pathname: '/account',
      locale: getLocale(),
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()

  return (
    <>
      <Profile key={user.id} user={user} />
      <ActiveSessions userId={user.id} />
    </>
  )
}
