import type { ErrorComponentProps } from '@tanstack/react-router'

import { createFileRoute, notFound } from '@tanstack/react-router'

import { Mdx } from '@/components/mdx/mdx'
import { OceanPage } from '@/components/ocean-page'
import { PageHeader } from '@/components/page-header'
import { PagePending } from '@/components/page-pending'
import { RouteError } from '@/components/route-error'
import { getPage } from '@/features/pages/pages.functions'
import { createJsonLdWebPage } from '@/lib/json-ld'
import { createSeoHead } from '@/lib/seo'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/_main/privacy')({
  loader: async () => {
    const locale = getLocale()
    const page = await getPage({ data: { slug: 'privacy', locale } })

    if (!page) throw notFound()

    return { page, locale }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const { page, locale } = loaderData

    return createSeoHead({
      title: page.title,
      description: page.description,
      pathname: '/privacy',
      locale,
      jsonLd: createJsonLdWebPage({
        title: page.title,
        description: page.description,
        pathname: '/privacy',
        locale,
      }),
    })
  },
  pendingComponent: () => <PagePending title={m.common_labels_privacy()} narrow />,
  errorComponent: PrivacyError,
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

function PrivacyError(props: ErrorComponentProps) {
  return (
    <OceanPage>
      <div className='mx-auto max-w-prose'>
        <RouteError {...props} />
      </div>
    </OceanPage>
  )
}
