import { createFileRoute, notFound } from '@tanstack/react-router'

import { getPage } from '@/features/pages/pages.functions'
import { ProfileError, ProfilePending } from '@/features/profile/profile-layout'
import { UsesPage } from '@/features/profile/uses-page'
import { createJsonLdWebPage } from '@/lib/json-ld'
import { createSeoHead } from '@/lib/seo'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/_main/uses')({
  loader: async () => {
    const locale = getLocale()
    const page = await getPage({ data: { slug: 'uses', locale } })

    if (!page) throw notFound()

    return { page, locale }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const { page, locale } = loaderData

    return createSeoHead({
      title: page.title,
      description: page.description,
      pathname: '/uses',
      locale,
      jsonLd: createJsonLdWebPage({
        title: page.title,
        description: page.description,
        pathname: '/uses',
        locale,
      }),
    })
  },
  pendingComponent: ProfilePending,
  errorComponent: ProfileError,
  component: RouteComponent,
})

function RouteComponent() {
  const { page } = Route.useLoaderData()

  return <UsesPage page={page} />
}
