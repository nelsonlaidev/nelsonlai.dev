import type { ProfilePageData } from './profile-layout'

import { ExternalLink } from '@repo/ui/components/external-link'
import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { ArrowRightIcon } from 'lucide-react'

import { Mdx } from '@/components/mdx/mdx'
import { m } from '@/paraglide/messages'

import { ProductImage } from './product-image'
import { ProfileLayout } from './profile-layout'

const USES_SECTION_NOTES = {
  laptop: m.profile_uses_go,
  accessories: m.profile_uses_ride,
  hardware: m.profile_uses_at_desk,
  coding: m.profile_uses_making,
  software: m.profile_uses_companions,
} as const

type UseKind = keyof typeof USES_SECTION_NOTES
type UseItem = {
  image: string
  name: string
  description: string
  url: string
  quantity?: number
}

type UsesSectionProps = {
  kind: UseKind
  title: string
  index: number
  children: React.ReactNode
}

function UsesSection(props: UsesSectionProps) {
  const { kind, title, index, children } = props

  return (
    <section id={kind} aria-labelledby={`${kind}-heading`} className='mb-16.25 scroll-mt-10 max-[601px]:mb-11.25'>
      <div className='mb-6 flex items-baseline justify-between gap-4 max-[1101px]:flex-wrap max-[601px]:mb-5 max-[601px]:flex-col max-[601px]:gap-2'>
        <h2
          id={`${kind}-heading`}
          className='text-[25px] leading-[1.35] font-[410] tracking-[-0.035em] max-[601px]:text-[23px]'
        >
          {title}
        </h2>
        <span className='text-sm/normal whitespace-nowrap text-[#b3cbc1]'>
          {String(index + 1).padStart(2, '0')} / {USES_SECTION_NOTES[kind]()}
        </span>
      </div>
      {children}
    </section>
  )
}

type UsesItemsProps = {
  items: UseItem[]
  kind: Exclude<UseKind, 'laptop'>
}

function UsesItems(props: UsesItemsProps) {
  const { kind, items } = props

  return (
    <div
      className={cn(
        kind === 'accessories' && 'border',
        (kind === 'accessories' || kind === 'coding' || kind === 'software') && 'grid grid-cols-2',
        kind === 'accessories' && 'border-border bg-[#082f3ba8] max-[1101px]:grid-cols-1',
        (kind === 'hardware' || kind === 'coding' || kind === 'software') && 'border-t border-t-border',
        (kind === 'coding' || kind === 'software') && 'gap-y-0 max-[601px]:grid-cols-1',
        kind === 'coding' && 'gap-x-7 bg-[#082f3b80] px-6 pt-1 pb-0 max-[601px]:px-4.5 max-[601px]:py-0',
        kind === 'software' && 'gap-x-8.75',
      )}
    >
      {items.map((item, index) => (
        <ExternalLink
          href={item.url}
          key={item.name}
          className={cn(
            'flex min-w-0 items-center gap-5.5 border-b-border transition-colors duration-200 ease-linear hover:bg-[#bdd9ca0a] motion-reduce:transition-none max-[601px]:gap-3.5',
            (kind === 'hardware' || kind === 'coding' || kind === 'software') &&
              'border-b py-5.75 max-[601px]:px-0 max-[601px]:py-5',
            (kind === 'coding' || kind === 'software') && 'px-0',
            kind === 'accessories' &&
              'border-0 p-6.25 not-first:border-l not-first:border-l-border max-[1101px]:not-first:border-t max-[1101px]:not-first:border-l-0 max-[1101px]:not-first:border-t-border max-[601px]:px-5 max-[601px]:py-5.5',
            kind === 'hardware' && 'pr-3 pl-0 max-[601px]:pr-3',
          )}
        >
          {kind === 'hardware' && (
            <span
              aria-hidden='true'
              className='min-w-4.5 text-xs/normal text-[#b3cbc1] tabular-nums max-[601px]:hidden'
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
          <ProductImage
            src={item.image}
            alt=''
            width={64}
            height={64}
            loading='lazy'
            className={cn(
              'flex-[0_0_48px] object-contain',
              kind === 'accessories' &&
                'h-17.5 w-15 basis-15 max-[601px]:h-13.5 max-[601px]:w-10.5 max-[601px]:basis-10.5',
              kind === 'hardware' && 'h-15 w-16 basis-16 max-[601px]:size-11.5 max-[601px]:basis-11.5',
              (kind === 'coding' || kind === 'software') && 'size-8.5 basis-8.5',
            )}
          />
          <span className='min-w-0 flex-1'>
            <span className='block text-base/[1.65] font-medium tracking-[-0.02em] wrap-anywhere'>
              {item.name}
              {item.quantity && (
                <span className='ml-2.25 inline-flex items-center rounded-md border border-[#a8cbbe65] bg-[#b8d5c80c] px-1.75 py-px align-middle text-sm leading-[1.6] font-medium tracking-normal whitespace-nowrap text-[#d1e2d6]'>
                  <span aria-hidden='true'>×{item.quantity}</span>
                  <span className='sr-only'> {m.profile_uses_monitors({ count: item.quantity })}</span>
                </span>
              )}
            </span>
            <span className='mt-1.25 block text-sm/[1.7] text-[#b3cbc1]'>{item.description}</span>
          </span>
          <ArrowRightIcon className='size-4.5 shrink-0 transform-[rotate(-45deg)] text-[#a9cbbc]' aria-hidden='true' />
        </ExternalLink>
      ))}
    </div>
  )
}

type UsesLaptopProps = {
  src: string
  alt: string
  width: number
  height: number
  name: string
  description: string
}

function UsesLaptop(props: UsesLaptopProps) {
  const { name, description, ...imageProps } = props

  return (
    <div className='border border-[#a8cbbe45] [background:radial-gradient(ellipse_at_50%_12%,#a9d6bf18,transparent_70%),#082f3ba8]'>
      <div className='px-[9%] pt-8.5 pb-2.5 max-[601px]:px-[4%] max-[601px]:pt-6.25 max-[601px]:pb-3.75'>
        <ProductImage {...imageProps} fetchPriority='high' className='block h-auto w-full' />
      </div>
      <div className='flex items-center justify-between gap-5 border-t border-t-border px-8 py-6.5 max-[601px]:p-5'>
        <div>
          <span className='block text-xs/normal text-[#b3cbc1]'>{m.profile_uses_portable()}</span>
          <h3 className='mx-0 mt-3.25 mb-2.5 text-[clamp(20px,2.2vw,28px)] leading-normal font-[450] tracking-[-0.035em]'>
            {name}
          </h3>
          <p className='m-0 text-base/[1.65] text-[#b3cbc1]'>{description}</p>
        </div>
        <span
          aria-hidden='true'
          className='text-5xl leading-[normal] font-[250] tracking-[-0.06em] text-[#b9d4c7] max-[601px]:hidden'
        >
          16<span className='block text-right text-sm leading-[normal] tracking-normal'>inch</span>
        </span>
      </div>
    </div>
  )
}

type UsesPageProps = {
  page: ProfilePageData
}

export function UsesPage(props: UsesPageProps) {
  const { page } = props

  return (
    <ProfileLayout>
      <div>
        <div className='flex items-end justify-between gap-8.75 border-b border-b-border pb-15.5 max-[801px]:pb-10'>
          <div className='m-0'>
            <span className='block text-xs/normal text-section-label'>05 / {m.profile_uses_log()}</span>
            <h1 className='mt-6 text-[clamp(48px,5.8vw,86px)] leading-[1.04] font-[420] tracking-[-0.065em]'>
              {page.title}
              <span className='text-[#a8d3b7]'>.</span>
              <br />
              <em className='font-serif font-normal text-[#bed3c6]'>{m.profile_uses_behind()}</em>
            </h1>
            <p className='mt-7 max-w-150 text-lg/[1.65] whitespace-pre-line text-[#b1cbc4]'>{page.description}</p>
          </div>
          <div className='flex flex-col gap-2.5 pb-1.25 text-sm/normal text-[#b1cbc4] max-[801px]:hidden'>
            <span className='first:text-[#dfebdf]'>{m.profile_uses_desk()}</span>
            <span className='first:text-[#dfebdf]'>{m.profile_uses_range()}</span>
            <span className='mt-5 h-4.5 border-b border-b-[#9abfb273] [background:repeating-linear-gradient(to_right,#9abfb273_0_1px,transparent_1px_10px)] first:text-[#dfebdf]' />
          </div>
        </div>
        <Mdx path={page.path} unstyled components={{ UsesSections }} />
      </div>
    </ProfileLayout>
  )
}

export type UsesSectionData =
  | {
      kind: 'laptop'
      title: string
      items: UsesLaptopProps[]
    }
  | {
      kind: Exclude<UseKind, 'laptop'>
      title: string
      items: UseItem[]
    }

type UsesSectionsProps = {
  sections: UsesSectionData[]
}

function UsesSections(props: UsesSectionsProps) {
  const { sections } = props

  return (
    <div className='grid grid-cols-[230px_minmax(0,1fr)] gap-12.5 pt-13.75 max-[1101px]:grid-cols-[180px_minmax(0,1fr)] max-[1101px]:gap-8.75 max-[801px]:block max-[801px]:pt-7.5'>
      <aside className='sticky top-10 self-start max-[801px]:static max-[801px]:mb-11.25'>
        <nav aria-label={m.profile_uses_index()} className='max-[801px]:flex max-[801px]:flex-wrap max-[801px]:gap-2'>
          <span className='mb-6.25 block text-xs/normal text-section-label max-[801px]:mb-2.5 max-[801px]:w-full'>
            {m.profile_uses_index()}
          </span>
          {sections.map((section, index) => (
            <a
              href={`#${section.kind}`}
              key={section.kind}
              className='grid grid-cols-[20px_1fr_24px] items-baseline gap-2 border-b border-b-border px-0 py-4 text-sm leading-[1.6] text-[#d1e2d6] hover:border-[#b8d5c8] hover:text-white max-[801px]:flex max-[801px]:min-h-11 max-[801px]:rounded-md max-[801px]:border max-[801px]:border-border max-[801px]:px-3 max-[801px]:py-2.5 max-[801px]:text-sm'
            >
              <span className='text-xs/[1.6] text-[#a6c5bb] max-[801px]:hidden'>0{index + 1}</span>
              <span>{section.title}</span>
              <span className='text-right text-xs/[1.6] text-[#a6c5bb] max-[801px]:hidden'>
                {String(section.items.length).padStart(2, '0')}
              </span>
            </a>
          ))}
        </nav>
        <p className='mt-7.5 max-w-43.75 text-sm leading-[1.9] text-[#a6c5bb] max-[801px]:hidden'>
          {m.profile_uses_inventory()}
        </p>
      </aside>
      <div>
        {sections.map((section, index) => (
          <UsesSection key={section.kind} kind={section.kind} title={section.title} index={index}>
            {section.kind === 'laptop' ? (
              section.items.map((item) => <UsesLaptop key={item.name} {...item} />)
            ) : (
              <UsesItems kind={section.kind} items={section.items} />
            )}
          </UsesSection>
        ))}
        <div className='px-0 pt-3.75 pb-8.75'>
          <p className='mx-0 mt-0 mb-6.25 text-[27px] leading-normal tracking-[-0.03em] max-[601px]:text-2xl'>
            {m.profile_uses_tools_part()}
            <br />
            <em className='text-[#bed3c6] not-italic'>{m.profile_uses_make()}</em>
          </p>
          <Link to='/projects' className='inline-flex min-h-11 items-center gap-4 text-sm/normal text-link'>
            {m.profile_about_projects()}
            <ArrowRightIcon className='size-4.75' aria-hidden='true' />
          </Link>
        </div>
      </div>
    </div>
  )
}
