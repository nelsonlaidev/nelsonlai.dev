import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { OceanPage } from '@/components/ocean-page'
import { guestbookMessagesInfiniteOptions } from '@/features/guestbook/guestbook.queries'
import { MessageBoard } from '@/features/guestbook/message-board'
import { getPage } from '@/features/pages/pages.functions'
import { ProfileError, ProfilePending } from '@/features/profile/profile-layout'
import { createJsonLdWebPage } from '@/lib/json-ld'
import { createSeoHead } from '@/lib/seo'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/_main/guestbook')({
  loader: async ({ context }) => {
    const locale = getLocale()
    const page = await getPage({ data: { slug: 'guestbook', locale } })

    if (!page) throw notFound()

    try {
      await context.queryClient.infiniteQuery(guestbookMessagesInfiniteOptions)
    } catch {
      // Messages owns the query error and retry UI, so the composer stays usable.
    }

    return { page, locale }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const { page, locale } = loaderData

    return createSeoHead({
      title: page.title,
      description: page.description,
      pathname: '/guestbook',
      locale,
      jsonLd: createJsonLdWebPage({
        title: page.title,
        description: page.description,
        pathname: '/guestbook',
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
        <div
          aria-hidden='true'
          className='mx-auto mt-0 mb-11.25 size-1.25 rounded-full bg-[#d6f1cb] shadow-[0_0_25px_10px_#9fe4c045,0_0_130px_70px_#69beaa14]'
        />
        <header className='text-center'>
          <span className='block text-xs leading-[normal] tracking-[0.02em] text-section-label'>04 / {page.title}</span>
          <h1 className='mx-auto mt-6 mb-0 w-full text-[clamp(48px,5.8vw,86px)] leading-[1.04] font-[420] tracking-[-0.065em] max-[601px]:text-[43px]'>
            {page.title}
          </h1>
          <p className='mx-auto mt-7 mb-0 max-w-150 text-lg/[1.65] whitespace-pre-line text-[#b1cbc4] max-[601px]:mt-6'>
            {m.seabed_intro()}
          </p>
        </header>
        <MessageBoard />
        <div className='pt-27.5 text-center max-[601px]:pt-16.25'>
          <span aria-hidden='true' className='inline-block h-px w-6.25 bg-[#9cbda566]' />
          <p className='mt-6.25 font-serif text-xl/normal text-[#a5c3ad] italic max-[601px]:text-lg max-[601px]:leading-[1.7]'>
            {m.seabed_ending()}
          </p>
          <Link to='/' className='mt-6.25 inline-flex min-h-11 items-center gap-3 text-sm/normal text-[#b8d1b6]'>
            {m.seabed_surface()} <ArrowRightIcon aria-hidden='true' className='w-5' />
          </Link>
        </div>
      </div>
    </OceanPage>
  )
}
