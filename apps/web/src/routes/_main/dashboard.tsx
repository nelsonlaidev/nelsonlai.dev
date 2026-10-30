import { createFileRoute, notFound } from '@tanstack/react-router'

import { OceanPage } from '@/components/ocean-page'
import { getPage } from '@/features/pages/pages.functions'
import { ProfileError, ProfilePending } from '@/features/profile/profile-layout'
import { createJsonLdWebPage } from '@/lib/json-ld'
import { orpc } from '@/lib/orpc-client'
import { createSeoHead } from '@/lib/seo'
import { m } from '@/paraglide/messages'
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
  pendingComponent: ProfilePending,
  errorComponent: ProfileError,
  component: RouteComponent,
})

function RouteComponent() {
  const { page } = Route.useLoaderData()

  return (
    <OceanPage>
      <div className='wrap-anywhere'>
        <header className='mb-13.75 max-[601px]:mb-9'>
          <h1 className='m-0 text-[clamp(48px,5.8vw,86px)] leading-[1.04] font-[420] tracking-[-0.065em] max-[601px]:text-[46px]'>
            {page.title}
            <span aria-hidden='true' className='text-[#b9d7bf]'>
              .
            </span>
          </h1>
          <p className='mt-5.5 text-lg/[1.65] text-[#c0d4ce]'>{m.dashboard_intro()}</p>
        </header>
        <DashboardStats />
      </div>
    </OceanPage>
  )
}
