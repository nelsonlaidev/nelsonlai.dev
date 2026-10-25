import { createFileRoute, notFound } from '@tanstack/react-router'

import { Mdx } from '@/components/mdx/mdx'
import { PageHeader } from '@/components/page-header'
import { ENV } from '@/env'
import { getPage } from '@/features/pages/pages.functions'
import { SITE } from '@/lib/site'
import { baseLocale, getLocale, locales, localizeUrl } from '@/paraglide/runtime'

export const Route = createFileRoute('/_main/about')({
  loader: async () => {
    const locale = getLocale()
    const page = await getPage({ data: { slug: 'about', locale } })

    if (!page) {
      throw notFound()
    }

    return { page, locale }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const { page, locale } = loaderData
    const title = `${page.title} | Nelson Lai`
    const url = new URL('/about', ENV.SITE_URL)
    const canonical = localizeUrl(url, { locale }).href

    return {
      meta: [
        { title },
        { name: 'description', content: page.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: page.description },
        { property: 'og:url', content: canonical },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: page.description },
        {
          'script:ld+json': {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: page.title,
            description: page.description,
            url: canonical,
            inLanguage: locale,
            mainEntity: {
              '@type': 'Person',
              name: 'Nelson Lai',
              description: page.description,
              url: ENV.SITE_URL,
              sameAs: Object.values(SITE.socials),
            },
          },
        },
      ],
      links: [
        { rel: 'canonical', href: canonical },
        { rel: 'alternate', hrefLang: 'x-default', href: localizeUrl(url, { locale: baseLocale }).href },
        ...locales.map((alternateLocale) => ({
          rel: 'alternate',
          hrefLang: alternateLocale,
          href: localizeUrl(url, { locale: alternateLocale }).href,
        })),
      ],
    }
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
