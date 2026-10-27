import { createFileRoute, notFound } from '@tanstack/react-router'

import { Mdx } from '@/components/mdx/mdx'
import { PageHeader } from '@/components/page-header'
import { ENV } from '@/env'
import { getPage } from '@/features/pages/pages.functions'
import { createSeoHead, getLocalizedUrl } from '@/lib/seo'
import { SITE } from '@/lib/site'
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
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: page.title,
        description: page.description,
        url: getLocalizedUrl('/uses', locale),
        inLanguage: locale,
        isPartOf: {
          '@type': 'WebSite',
          name: SITE.name,
          url: ENV.SITE_URL,
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
