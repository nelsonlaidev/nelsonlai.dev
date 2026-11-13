import { createFileRoute, notFound } from '@tanstack/react-router'

import { Mdx } from '@/components/mdx/mdx'
import { OceanPage } from '@/components/ocean-page'
import { PageHeader } from '@/components/page-header'
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
    const pathname = '/terms'

    return createSeoHead({
      title: page.title,
      description: page.description,
      pathname,
      locale,
      jsonLd: createJsonLdWebPage({
        title: page.title,
        description: page.description,
        pathname,
        locale,
      }),
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { page } = Route.useLoaderData()

  return (
    <OceanPage>
      <div className='mx-auto max-w-prose'>
        <PageHeader title={page.title} description={page.description} />
        <article aria-label={page.title}>
          <Mdx code={page.code} />
        </article>
      </div>
    </OceanPage>
  )
}
