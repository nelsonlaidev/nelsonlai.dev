import type { ErrorComponentProps } from '@tanstack/react-router'

import { createFileRoute, notFound } from '@tanstack/react-router'

import { OceanPage } from '@/components/ocean-page'
import { PageHeader } from '@/components/page-header'
import { PagePending } from '@/components/page-pending'
import { RouteError } from '@/components/route-error'
import { guestbookMessagesInfiniteOptions } from '@/features/guestbook/guestbook.queries'
import { MessageBoard } from '@/features/guestbook/message-board'
import { getPage } from '@/features/pages/pages.functions'
import { createJsonLdWebPage } from '@/lib/json-ld'
import { createSeoHead } from '@/lib/seo'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/_main/guestbook')({
  loader: async ({ context }) => {
    const locale = getLocale()
    const page = await getPage({ data: { slug: 'guestbook', locale } })

    if (!page) throw notFound()

    await context.queryClient.infiniteQuery(guestbookMessagesInfiniteOptions)

    return { page, locale }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const { page, locale } = loaderData

    return createSeoHead({
      title: page.title,
      description: page.description,
      pathname: '/guestbook',
      locale,
      jsonLd: createJsonLdWebPage({
        title: page.title,
        description: page.description,
        pathname: '/guestbook',
        locale,
      }),
    })
  },
  pendingComponent: () => <PagePending title={m.nav_guestbook()} description={m.seabed_intro()} />,
  errorComponent: GuestbookError,
  component: RouteComponent,
})

function RouteComponent() {
  const { page } = Route.useLoaderData()

  return (
    <OceanPage>
      <PageHeader title={page.title} description={m.seabed_intro()} />
      <MessageBoard />
    </OceanPage>
  )
}

function GuestbookError(props: ErrorComponentProps) {
  return (
    <OceanPage>
      <RouteError {...props} />
    </OceanPage>
  )
}
