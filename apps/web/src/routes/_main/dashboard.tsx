import { createFileRoute, notFound } from '@tanstack/react-router'

import { PageHeader } from '@/components/page-header'
import { getPage } from '@/features/pages/pages.functions'
import { createJsonLdWebPage } from '@/lib/json-ld'
import { orpc } from '@/lib/orpc-client'
import { createSeoHead } from '@/lib/seo'
import { getLocale } from '@/paraglide/runtime'

import { DashboardStats } from './-components/dashboard/stats'

export const Route = createFileRoute('/_main/dashboard')({
  loader: async ({ context }) => {
    const locale = getLocale()
    const page = await getPage({ data: { slug: 'dashboard', locale } })

    if (!page) throw notFound()

    void Promise.allSettled([
      context.queryClient.query(orpc.github.stats.queryOptions()),
      context.queryClient.query(orpc.youtube.stats.queryOptions()),
      context.queryClient.query(orpc.posts.totals.queryOptions()),
      context.queryClient.query(orpc.wakatime.stats.queryOptions()),
    ])

    return { page, locale }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const { page, locale } = loaderData

    return createSeoHead({
      title: page.title,
      description: page.description,
      pathname: '/dashboard',
      locale,
      jsonLd: createJsonLdWebPage({
        title: page.title,
        description: page.description,
        pathname: '/dashboard',
        locale,
      }),
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { page } = Route.useLoaderData()

  return (
    <>
      <PageHeader title={page.title} description={page.description} />
      <DashboardStats />
    </>
  )
}
