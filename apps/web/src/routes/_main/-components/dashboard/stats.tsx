import { SiGithub, SiWakatime, SiYoutube } from '@icons-pack/react-simple-icons'
import { ExternalLink } from '@repo/ui/components/external-link'
import { useSuspenseQuery } from '@tanstack/react-query'
import { CatchBoundary } from '@tanstack/react-router'
import { ArrowRightIcon, PencilIcon, StarIcon } from 'lucide-react'
import { Suspense } from 'react'

import { orpc } from '@/lib/orpc-client'
import { SITE } from '@/lib/site'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

import { Counter } from './counter'

type Stat = {
  title: string
  link: string
  linkText: string
  icon: React.ReactNode
  field: 'hours' | 'subscribers' | 'views' | 'followers' | 'stars' | 'likes'
  gradient: string
  suffix?: string
}

export function DashboardStats() {
  const wakatimeStats: Stat[] = [
    {
      title: m.dashboard_stat_coding_hours(),
      link: 'https://wakatime.com/@nelsonlaidev',
      linkText: 'WakaTime',
      icon: <SiWakatime className='size-6 text-[#0061ff]' aria-hidden='true' />,
      field: 'hours',
      gradient: 'linear-gradient(122.25deg, #0061ff 12.16%, #6f7bf7 70.98%)',
      suffix: 'hrs',
    },
  ]
  const youtubeStats: Stat[] = [
    {
      title: m.dashboard_stat_youtube_subscribers(),
      link: SITE.socials.youtube,
      linkText: 'YouTube',
      icon: <SiYoutube className='size-6 text-[#ff0000]' aria-hidden='true' />,
      field: 'subscribers',
      gradient: 'linear-gradient(122.25deg, #ff0000 12.16%, #ca1a1a 70.98%)',
    },
    {
      title: m.dashboard_stat_youtube_views(),
      link: SITE.socials.youtube,
      linkText: 'YouTube',
      icon: <SiYoutube className='size-6 text-[#ff0000]' aria-hidden='true' />,
      field: 'views',
      gradient: 'linear-gradient(122.25deg, #ff0000 12.16%, #ca1a1a 70.98%)',
    },
  ]
  const githubStats: Stat[] = [
    {
      title: m.dashboard_stat_github_followers(),
      link: SITE.socials.github,
      linkText: 'GitHub',
      icon: <SiGithub className='size-6 text-[#fee000]' aria-hidden='true' />,
      field: 'followers',
      gradient: 'linear-gradient(122.25deg, #fee000 12.16%, #ffce63 70.98%)',
    },
    {
      title: m.dashboard_stat_github_stars(),
      link: SITE.socials.github,
      linkText: 'GitHub',
      icon: <StarIcon className='size-6 text-[#fee000]' aria-hidden='true' />,
      field: 'stars',
      gradient: 'linear-gradient(122.25deg, #fee000 12.16%, #ffce63 70.98%)',
    },
  ]
  const postStats: Stat[] = [
    {
      title: m.dashboard_stat_blog_total_views(),
      link: 'https://nelsonlai.dev',
      linkText: 'Blog',
      icon: <PencilIcon className='size-6 text-[#ff0f7b]' aria-hidden='true' />,
      field: 'views',
      gradient: 'linear-gradient(122.25deg, #ff0f7b 12.16%, #f945ff 70.98%)',
    },
    {
      title: m.dashboard_stat_blog_total_likes(),
      link: 'https://nelsonlai.dev',
      linkText: 'Blog',
      icon: <PencilIcon className='size-6 text-[#ff0f7b]' aria-hidden='true' />,
      field: 'likes',
      gradient: 'linear-gradient(122.25deg, #ff0f7b 12.16%, #f945ff 70.98%)',
    },
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
      <StatGroup stats={wakatimeStats}>
        <WakatimeStats stats={wakatimeStats} />
      </StatGroup>
      <StatGroup stats={youtubeStats}>
        <YoutubeStats stats={youtubeStats} />
      </StatGroup>
      <StatGroup stats={githubStats}>
        <GithubStats stats={githubStats} />
      </StatGroup>
      <StatGroup stats={postStats}>
        <PostStats stats={postStats} />
      </StatGroup>
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

type StatSourceProps = {
  stats: Stat[]
}

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

function StatCards(props: StatCardsProps) {
  const { stats, values, isError = false } = props

  return (
    <>
      {stats.map(({ title, link, linkText, icon, field, gradient, suffix }) => {
        const value = values?.[field]

        return (
          <ExternalLink
            key={title}
            href={link}
            className='group relative overflow-hidden rounded-xl border p-4 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none'
          >
            <div className='flex flex-col items-center justify-center gap-2 transition-transform group-hover:-translate-y-24 group-focus-visible:-translate-y-24 motion-reduce:transition-none'>
              <div className='flex min-h-9 items-center gap-2 text-3xl font-semibold tabular-nums'>
                {value === undefined ? (
                  <span className='text-muted-foreground'>{isError ? m.common_error() : '--'}</span>
                ) : (
                  <>
                    {icon}
                    <span className='bg-clip-text text-transparent' style={{ backgroundImage: gradient }}>
                      <Counter value={value} />
                      {suffix && <span>{` ${suffix}`}</span>}
                    </span>
                  </>
                )}
              </div>
              <h2 className='text-center text-xl font-semibold'>{title}</h2>
            </div>
            <span
              aria-hidden='true'
              className='absolute top-1/2 left-1/2 flex -translate-x-1/2 translate-y-24 items-center gap-1 text-2xl font-semibold opacity-0 transition group-hover:-translate-y-1/2 group-hover:opacity-100 group-focus-visible:-translate-y-1/2 group-focus-visible:opacity-100 motion-reduce:transition-none'
            >
              {linkText}
              <ArrowRightIcon className='size-6' />
            </span>
          </ExternalLink>
        )
      })}
    </>
  )
}
