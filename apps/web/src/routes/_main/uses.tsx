import { BlurImage } from '@repo/ui/components/blur-image'
import { ExternalLink } from '@repo/ui/components/external-link'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { Mdx } from '@/components/mdx/mdx'
import { OceanPage } from '@/components/ocean-page'
import { PageHeader } from '@/components/page-header'
import { getPage } from '@/features/pages/pages.functions'
import { createJsonLdWebPage } from '@/lib/json-ld'
import { createSeoHead } from '@/lib/seo'
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
    const pathname = '/uses'

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
      <PageHeader title={page.title} description={page.description} />
      <Mdx code={page.code} unstyled components={{ UsesLaptop, UsesSection }} />
    </OceanPage>
  )
}

type UseItem = {
  image: string
  name: string
  description: string
  url: string
}

type UsesSectionProps = {
  id: string
  title: string
  items: UseItem[]
}

function UsesSection(props: UsesSectionProps) {
  const { id, title, items } = props

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className='mb-12 scroll-mt-10 sm:mb-16'>
      <h2 id={`${id}-heading`} className='mb-6 text-2xl tracking-tight'>
        {title}
      </h2>
      <div className='grid grid-cols-1 gap-x-10 border-t sm:grid-cols-2'>
        {items.map((item) => (
          <ExternalLink
            href={item.url}
            key={item.name}
            className='group flex min-w-0 items-center gap-3.5 border-b px-4 py-5 transition-[background-color] duration-200 ease-linear hover:bg-primary/5 motion-reduce:transition-none sm:gap-6 sm:px-5 sm:py-6'
          >
            <BlurImage
              src={item.image}
              alt=''
              width={64}
              height={64}
              className='size-16 shrink-0 basis-16'
              imageClassName='size-full object-contain'
            />
            <span className='min-w-0 flex-1'>
              <span className='mb-1.5 block text-base/relaxed font-medium tracking-tight'>{item.name}</span>
              <span className='block text-sm/relaxed text-muted-foreground'>{item.description}</span>
            </span>
            <ArrowRightIcon
              className='size-5 shrink-0 -rotate-45 text-primary transition-[rotate] duration-200 ease-linear group-hover:rotate-0 motion-reduce:transition-none'
              aria-hidden='true'
            />
          </ExternalLink>
        ))}
      </div>
    </section>
  )
}

type UsesLaptopProps = {
  title: string
  src: string
  alt: string
  width: number
  height: number
  name: string
  description: string
}

function UsesLaptop(props: UsesLaptopProps) {
  const { title, name, description, ...imageProps } = props

  return (
    <section id='laptop' aria-labelledby='laptop-heading' className='mb-12 scroll-mt-10 sm:mb-16'>
      <h2 id='laptop-heading' className='mb-6 text-2xl tracking-tight'>
        {title}
      </h2>
      <div className='border bg-card/65 bg-radial-[ellipse_at_50%_12%] from-primary/10 to-transparent to-70%'>
        <div className='p-5 sm:px-8 sm:py-6'>
          <BlurImage {...imageProps} lazy={false} className='block w-full' imageClassName='block h-auto w-full' />
        </div>
        <div className='flex items-center justify-between gap-5 border-t p-5 sm:px-8 sm:py-7'>
          <div>
            <h3 className='mb-2.5 text-xl font-medium tracking-tight sm:text-2xl lg:text-3xl'>{name}</h3>
            <p className='text-base/relaxed text-muted-foreground'>{description}</p>
          </div>
          <span aria-hidden='true' className='hidden text-5xl font-light tracking-tighter text-section-label sm:block'>
            16<span className='block text-right text-sm tracking-normal'>inch</span>
          </span>
        </div>
      </div>
    </section>
  )
}
