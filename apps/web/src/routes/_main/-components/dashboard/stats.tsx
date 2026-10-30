import { ExternalLink } from '@repo/ui/components/external-link'
import { useSuspenseQuery } from '@tanstack/react-query'
import { CatchBoundary, Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { ArrowRightIcon } from 'lucide-react'
import { Suspense } from 'react'

import { orpc } from '@/lib/orpc-client'
import { SITE } from '@/lib/site'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

import { Counter } from './counter'

type Stat = {
  title: string
  field: 'hours' | 'subscribers' | 'views' | 'followers' | 'stars' | 'likes'
  suffix?: string
}

export function DashboardStats() {
  const groups = [
    {
      id: 'coding',
      name: m.dashboard_coding(),
      link: 'https://wakatime.com/@nelsonlaidev',
      linkText: 'WakaTime',
      stats: [{ title: m.dashboard_stat_coding_hours(), field: 'hours', suffix: m.dashboard_hours() }],
      Source: WakatimeStats,
    },
    {
      id: 'github',
      name: 'GitHub',
      link: SITE.socials.github,
      linkText: 'GitHub',
      stats: [
        { title: m.dashboard_stat_github_stars(), field: 'stars' },
        { title: m.dashboard_stat_github_followers(), field: 'followers' },
      ],
      Source: GithubStats,
    },
    {
      id: 'youtube',
      name: 'YouTube',
      link: SITE.socials.youtube,
      linkText: 'YouTube',
      stats: [
        { title: m.dashboard_stat_youtube_subscribers(), field: 'subscribers' },
        { title: m.dashboard_stat_youtube_views(), field: 'views' },
      ],
      Source: YoutubeStats,
    },
    {
      id: 'blog',
      name: m.dashboard_blog(),
      link: '/blog',
      linkText: m.projects_read_blog(),
      stats: [
        { title: m.dashboard_stat_blog_total_views(), field: 'views' },
        { title: m.dashboard_stat_blog_total_likes(), field: 'likes' },
      ],
      Source: PostStats,
    },
  ] satisfies Array<{
    id: string
    name: string
    link: string
    linkText: string
    stats: Stat[]
    Source: React.ComponentType<StatSourceProps>
  }>

  return (
    <div className='grid grid-cols-2 border border-[#8eb8aa66] bg-[#082e3b] max-[851px]:grid-cols-1'>
      {groups.map((group) => (
        <section
          key={group.id}
          aria-labelledby={`dashboard-${group.id}-heading`}
          className='min-w-0 px-8.5 pt-8.5 pb-10.5 even:border-l even:border-l-[#8eb8aa45] nth-[n+3]:border-t nth-[n+3]:border-t-[#8eb8aa45] max-[1101px]:px-6 max-[1101px]:pt-7 max-[1101px]:pb-8.5 max-[851px]:not-first:border-t max-[851px]:not-first:border-t-[#8eb8aa45] max-[851px]:even:border-l-0 max-[601px]:px-5 max-[601px]:pt-6 max-[601px]:pb-7.5'
        >
          <div className='mb-9.5 flex items-center justify-between gap-5 max-[601px]:mb-7 max-[601px]:gap-3.75'>
            <h2
              id={`dashboard-${group.id}-heading`}
              className='text-[26px] leading-[1.3] font-[450] tracking-[-0.035em] max-[601px]:text-2xl'
            >
              {group.name}
            </h2>
            {group.id === 'blog' ? (
              <Link
                to='/blog'
                className='inline-flex min-h-11 items-center justify-end gap-3 text-sm/normal text-[#bdd7c9] hover:text-[#f0f6eb]'
              >
                {group.linkText}
                <ArrowRightIcon aria-hidden='true' className='size-5 shrink-0' />
              </Link>
            ) : (
              <ExternalLink
                href={group.link}
                className='inline-flex min-h-11 items-center justify-end gap-3 text-sm/normal text-[#bdd7c9] hover:text-[#f0f6eb]'
              >
                {group.linkText}
                <ArrowRightIcon aria-hidden='true' className='size-5 shrink-0' />
              </ExternalLink>
            )}
          </div>
          <StatGroup stats={group.stats}>
            <group.Source stats={group.stats} />
          </StatGroup>
        </section>
      ))}
    </div>
  )
}

type StatGroupProps = {
  stats: Stat[]
  children: React.ReactNode
}

function StatGroup(props: StatGroupProps) {
  const { stats, children } = props
  const locale = getLocale()

  return (
    <CatchBoundary getResetKey={() => locale} errorComponent={() => <StatCards stats={stats} isError />}>
      <Suspense fallback={<StatCards stats={stats} />}>{children}</Suspense>
    </CatchBoundary>
  )
}

type StatSourceProps = { stats: Stat[] }

function WakatimeStats(props: StatSourceProps) {
  const { stats } = props
  const { data } = useSuspenseQuery(orpc.wakatime.stats.queryOptions({ refetchOnWindowFocus: false }))

  return <StatCards stats={stats} values={data} />
}

function YoutubeStats(props: StatSourceProps) {
  const { stats } = props
  const { data } = useSuspenseQuery(orpc.youtube.stats.queryOptions({ refetchOnWindowFocus: false }))

  return <StatCards stats={stats} values={data} />
}

function GithubStats(props: StatSourceProps) {
  const { stats } = props
  const { data } = useSuspenseQuery(orpc.github.stats.queryOptions({ refetchOnWindowFocus: false }))

  return <StatCards stats={stats} values={data} />
}

function PostStats(props: StatSourceProps) {
  const { stats } = props
  const { data } = useSuspenseQuery(orpc.posts.totals.queryOptions())

  return <StatCards stats={stats} values={data} />
}

type StatCardsProps = {
  stats: Stat[]
  values?: Partial<Record<Stat['field'], number>>
  isError?: boolean
}

export function StatCards(props: StatCardsProps) {
  const { stats, values, isError = false } = props

  return (
    <dl
      aria-busy={!values && !isError}
      className={cn(
        'm-0 grid gap-7 max-[1101px]:gap-5 max-[601px]:grid-cols-1 max-[601px]:gap-6.5',
        stats[0]?.field !== 'hours' && 'grid-cols-2',
        stats[0]?.field === 'hours' && 'grid-cols-1',
      )}
    >
      {stats.map(({ title, field, suffix }) => {
        const value = values?.[field]
        return (
          <div
            key={field}
            className='min-w-0 max-[601px]:not-first:border-t max-[601px]:not-first:border-t-[#8eb8aa30] max-[601px]:not-first:pt-6'
          >
            <dt className='mb-3 text-base leading-[1.4] font-medium text-[#e0eade] max-[601px]:mb-2'>{title}</dt>
            <dd
              className={cn(
                'm-0 flex min-h-[1.1em] flex-wrap items-baseline gap-2.5 leading-[1.1] font-[420] tracking-[-0.055em] text-[#edf2e9] tabular-nums max-[601px]:text-5xl',
                stats[0]?.field !== 'hours' &&
                  'text-[clamp(40px,4vw,64px)] max-[1101px]:text-[44px] max-[851px]:text-[56px]',
                stats[0]?.field === 'hours' &&
                  'text-[clamp(56px,5vw,72px)] max-[1101px]:text-[64px] max-[851px]:text-[64px]',
                'leading-[1.1]',
              )}
            >
              {value !== undefined && Number.isFinite(value) ? (
                <>
                  <span className='max-w-full wrap-anywhere'>
                    <Counter value={value} />
                  </span>
                  {suffix && (
                    <span className='max-w-full text-lg/normal font-normal tracking-normal wrap-anywhere text-[#bdd7c9]'>
                      {suffix}
                    </span>
                  )}
                </>
              ) : (
                <output className='text-lg/[1.65] tracking-normal text-[#bdd7c9]'>
                  {isError || values ? m.dashboard_unavailable() : m.common_loading()}
                </output>
              )}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
