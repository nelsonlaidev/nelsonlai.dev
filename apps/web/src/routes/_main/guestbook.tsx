import { createFileRoute, notFound } from '@tanstack/react-router'

import { PageHeader } from '@/components/page-header'
import { ENV } from '@/env'
import { guestbookMessagesOptions } from '@/features/guestbook/guestbook.queries'
import { MessageBoard } from '@/features/guestbook/message-board'
import { getPage } from '@/features/pages/pages.functions'
import { createSeoHead, getLocalizedUrl } from '@/lib/seo'
import { SITE } from '@/lib/site'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/_main/guestbook')({
  loader: async ({ context }) => {
    const locale = getLocale()
    const page = await getPage({ data: { slug: 'guestbook', locale } })

    if (!page) throw notFound()

    await context.queryClient.infiniteQuery(guestbookMessagesOptions)

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
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: page.title,
        description: page.description,
        url: getLocalizedUrl('/guestbook', locale),
        isPartOf: {
          '@type': 'WebSite',
          name: SITE.name,
          url: ENV.SITE_URL,
        },
        inLanguage: locale,
      },
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { page } = Route.useLoaderData()

  return (
    <>
      <PageHeader title={page.title} description={page.description} />
      <MessageBoard />
    </>
  )
}
