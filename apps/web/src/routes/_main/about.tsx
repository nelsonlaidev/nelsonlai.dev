import type { ErrorComponentProps } from '@tanstack/react-router'

import { createFileRoute, notFound } from '@tanstack/react-router'

import { Mdx } from '@/components/mdx/mdx'
import { OceanPage } from '@/components/ocean-page'
import { PagePending } from '@/components/page-pending'
import { RouteError } from '@/components/route-error'
import { getPage } from '@/features/pages/pages.functions'
import { createJsonLdAboutPage } from '@/lib/json-ld'
import { createSeoHead } from '@/lib/seo'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

import { AboutHero } from './-components/about/hero'
import { AboutStory } from './-components/about/story'
import { AboutToolbox } from './-components/about/toolbox'

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
  pendingComponent: () => <PagePending title={m.nav_about()} description={m.home_about_intro()} />,
  errorComponent: AboutError,
  component: RouteComponent,
})

function RouteComponent() {
  const { page } = Route.useLoaderData()

  return (
    <OceanPage>
      <Mdx
        code={page.code}
        unstyled
        components={{
          AboutHero,
          AboutStory,
          AboutToolbox,
        }}
      />
    </OceanPage>
  )
}

function AboutError(props: ErrorComponentProps) {
  return (
    <OceanPage>
      <RouteError {...props} />
    </OceanPage>
  )
}
