import { createFileRoute } from '@tanstack/react-router'
import * as z from 'zod'

import { UnsubscribePage } from '@/features/notifications/unsubscribe-page'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/unsubscribe')({
  validateSearch: (search) => {
    const parsed = z.object({ token: z.string().max(4096).optional() }).safeParse(search)
    return parsed.success ? parsed.data : { token: undefined }
  },
  head: () => ({
    meta: [
      { title: m.common_labels_unsubscribe() },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'referrer', content: 'no-referrer' },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useSearch()
  return <UnsubscribePage token={token} />
}
