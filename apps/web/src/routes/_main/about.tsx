import { createFileRoute, notFound } from '@tanstack/react-router'

import { getPage } from '@/features/pages/pages.functions'
import { AboutPage } from '@/features/profile/about-page'
import { ProfileError, ProfilePending } from '@/features/profile/profile-layout'
import { createJsonLdAboutPage } from '@/lib/json-ld'
import { createSeoHead } from '@/lib/seo'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/_main/about')({
  loader: async () => {
    const locale = getLocale()
    const page = await getPage({ data: { slug: 'about', locale } })

    if (!page) throw notFound()

    return { page, locale }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const { page, locale } = loaderData

    return createSeoHead({
      title: page.title,
      description: page.description,
      pathname: '/about',
      locale,
      jsonLd: createJsonLdAboutPage({
        title: page.title,
        description: page.description,
        pathname: '/about',
        locale,
      }),
    })
  },
  component: RouteComponent,
  pendingComponent: ProfilePending,
  errorComponent: ProfileError,
})

function RouteComponent() {
  const { page } = Route.useLoaderData()

  return <AboutPage page={page} />
}
