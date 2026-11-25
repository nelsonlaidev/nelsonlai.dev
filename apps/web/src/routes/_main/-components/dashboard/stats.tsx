import { Button } from '@repo/ui/components/button'
import { ExternalLink } from '@repo/ui/components/external-link'
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { CatchBoundary, Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { ArrowRightIcon } from 'lucide-react'
import { Suspense } from 'react'

import { PendingCount } from '@/components/pending-count'
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

type Group = {
  id: string
  name: string
  link: string
  linkText: string
  stats: Stat[]
  source: React.ComponentType<StatSourceProps>
}

export function DashboardStats() {
  const groups: Group[] = [
    {
      id: 'coding',
      name: m.dashboard_coding(),
      link: 'https://wakatime.com/@nelsonlaidev',
      linkText: 'WakaTime',
      stats: [{ title: m.dashboard_stat_coding_hours(), field: 'hours', suffix: m.dashboard_hours() }],
      source: WakatimeStats,
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
      source: GithubStats,
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
      source: YoutubeStats,
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
      source: PostStats,
    },
  ]

  return (
    <div className='grid grid-cols-1 border bg-card lg:grid-cols-2'>
      {groups.map((group) => (
        <section
          key={group.id}
          aria-labelledby={`dashboard-${group.id}-heading`}
          className='min-w-0 px-5 pt-6 pb-8 not-first:border-t sm:px-6 sm:pt-7 sm:pb-9 lg:even:border-l lg:nth-2:border-t-0 xl:px-9 xl:pt-9 xl:pb-11'
        >
          <div className='mb-7 flex items-center justify-between gap-4 sm:mb-10 sm:gap-5'>
            <h2 id={`dashboard-${group.id}-heading`} className='text-2xl font-medium tracking-tight'>
              {group.name}
            </h2>
            {group.id === 'blog' ? (
              <Link
                to='/blog'
                className='group inline-flex items-center justify-end gap-2 text-sm text-link hover:text-foreground'
              >
                {group.linkText}
                <ArrowRightIcon
                  aria-hidden='true'
                  className='size-5 shrink-0 transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1 motion-reduce:transition-none'
                />
              </Link>
            ) : (
              <ExternalLink
                href={group.link}
                className='group inline-flex items-center justify-end gap-2 text-sm text-link hover:text-foreground'
              >
                {group.linkText}
                <ArrowRightIcon
                  aria-hidden='true'
                  className='size-5 shrink-0 transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1 motion-reduce:transition-none'
                />
              </ExternalLink>
            )}
          </div>
          <StatGroup stats={group.stats}>
            <group.source stats={group.stats} />
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
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <CatchBoundary
          getResetKey={() => locale}
          errorComponent={(errorProps) => (
            <div className='space-y-4'>
              <StatCards stats={stats} isError />
              <Button
                variant='outline'
                onClick={() => {
                  reset()
                  errorProps.reset()
                }}
              >
                {m.common_retry()}
              </Button>
            </div>
          )}
        >
          <Suspense fallback={<StatCards stats={stats} />}>{children}</Suspense>
        </CatchBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

type StatSourceProps = {
  stats: Stat[]
}

function WakatimeStats(props: StatSourceProps) {
  const { stats } = props
  const { data } = useSuspenseQuery(
    orpc.wakatime.stats.queryOptions({
      refetchOnWindowFocus: false,
    }),
  )

  return <StatCards stats={stats} values={data} />
}

function YoutubeStats(props: StatSourceProps) {
  const { stats } = props
  const { data } = useSuspenseQuery(
    orpc.youtube.stats.queryOptions({
      refetchOnWindowFocus: false,
    }),
  )

  return <StatCards stats={stats} values={data} />
}

function GithubStats(props: StatSourceProps) {
  const { stats } = props
  const { data } = useSuspenseQuery(
    orpc.github.stats.queryOptions({
      refetchOnWindowFocus: false,
    }),
  )

  return <StatCards stats={stats} values={data} />
}

function PostStats(props: StatSourceProps) {
  const { stats } = props
  const { data } = useSuspenseQuery(
    orpc.posts.totals.queryOptions({
      refetchOnWindowFocus: false,
    }),
  )

  return <StatCards stats={stats} values={data} />
}

type StatCardsProps = {
  stats: Stat[]
  values?: Partial<Record<Stat['field'], number>>
  isError?: boolean
}

export function StatCards(props: StatCardsProps) {
  const { stats, values, isError = false } = props
  const unavailable =
    !values && !isError ? (
      <PendingCount />
    ) : (
      <output className='text-lg tracking-normal text-muted-foreground'>{m.dashboard_unavailable()}</output>
    )
  const hasMultipleStats = stats.length > 1

  return (
    <dl
      aria-busy={!values && !isError}
      className={cn('grid grid-cols-1 gap-7 sm:gap-5 xl:gap-7', hasMultipleStats && 'sm:grid-cols-2')}
    >
      {stats.map(({ title, field, suffix }) => {
        const value = values?.[field]

        return (
          <div
            key={field}
            className='min-w-0 border-border/70 not-first:border-t not-first:pt-6 sm:not-first:border-t-0 sm:not-first:pt-0'
          >
            <dt className='mb-2 font-medium text-foreground sm:mb-3'>{title}</dt>
            <dd
              className={cn(
                'flex min-h-[1.1em] flex-wrap items-baseline gap-2.5 text-5xl tracking-tight text-foreground tabular-nums sm:text-6xl',
                hasMultipleStats && 'lg:text-5xl xl:text-6xl',
              )}
            >
              {value !== undefined && Number.isFinite(value) ? (
                <>
                  <span className='max-w-full wrap-anywhere'>
                    <Counter value={value} />
                  </span>
                  {suffix && <span className='max-w-full text-lg tracking-normal text-muted-foreground'>{suffix}</span>}
                </>
              ) : (
                unavailable
              )}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
