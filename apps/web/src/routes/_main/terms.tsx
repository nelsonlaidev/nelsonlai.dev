import { createFileRoute, notFound } from '@tanstack/react-router'

import { LegalError, LegalPage, LegalPending } from '@/features/legal/legal-page'
import { getPage } from '@/features/pages/pages.functions'
import { createJsonLdWebPage } from '@/lib/json-ld'
import { createSeoHead } from '@/lib/seo'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/_main/terms')({
  loader: async () => {
    const locale = getLocale()
    const page = await getPage({ data: { slug: 'terms', locale } })

    if (!page) throw notFound()

    return { page, locale }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const { page, locale } = loaderData

    return createSeoHead({
      title: page.title,
      description: page.description,
      pathname: '/terms',
      locale,
      jsonLd: createJsonLdWebPage({
        title: page.title,
        description: page.description,
        pathname: '/terms',
        locale,
      }),
    })
  },
  pendingComponent: LegalPending,
  errorComponent: LegalError,
  component: RouteComponent,
})

function RouteComponent() {
  const { page } = Route.useLoaderData()

  return <LegalPage page={page} kind='terms' />
}
