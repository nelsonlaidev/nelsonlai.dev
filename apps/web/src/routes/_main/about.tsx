import { createFileRoute, notFound } from '@tanstack/react-router'

import { Mdx } from '@/components/mdx/mdx'
import { PageHeader } from '@/components/page-header'
import { ENV } from '@/env'
import { getPage } from '@/features/pages/pages.functions'
import { createSeoHead, getLocalizedUrl } from '@/lib/seo'
import { SITE } from '@/lib/site'
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
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: page.title,
        description: page.description,
        url: getLocalizedUrl('/about', locale),
        inLanguage: locale,
        mainEntity: {
          '@type': 'Person',
          name: SITE.name,
          description: page.description,
          url: ENV.SITE_URL,
          sameAs: Object.values(SITE.socials),
        },
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
      <Mdx code={page.mdx} />
    </>
  )
}
