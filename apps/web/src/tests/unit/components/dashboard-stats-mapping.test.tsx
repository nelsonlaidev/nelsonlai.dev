import type * as ReactQuery from '@tanstack/react-query'
import type * as Router from '@tanstack/react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { m } from '@/paraglide/messages'
import { DashboardStats } from '@/routes/_main/-components/dashboard/stats'

type MockLinkProps = {
  to: string
  children: React.ReactNode
}

type CounterProps = {
  value: number
}

vi.mock('@/lib/orpc-client', () => ({
  orpc: {
    wakatime: { stats: { queryOptions: () => ({ data: { hours: 2345 } }) } },
    youtube: { stats: { queryOptions: () => ({ data: { subscribers: 123, views: 4567 } }) } },
    github: { stats: { queryOptions: () => ({ data: { stars: 89, followers: 10 } }) } },
    posts: { totals: { queryOptions: () => ({ data: { views: 1112, likes: 13 } }) } },
  },
}))

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof Router>()),
  Link: (props: MockLinkProps) => <a href={props.to}>{props.children}</a>,
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useSuspenseQuery: (result: { data: object }) => result,
}))

vi.mock('@/routes/_main/-components/dashboard/counter', () => ({
  Counter: (props: CounterProps) => <>{new Intl.NumberFormat('en').format(props.value)}</>,
}))

describe('Dashboard service mapping', () => {
  test('pairs each metric with its service value', () => {
    render(<DashboardStats />)

    for (const [label, value] of [
      [m.dashboard_stat_coding_hours(), '2,345hrs'],
      [m.dashboard_stat_github_stars(), '89'],
      [m.dashboard_stat_github_followers(), '10'],
      [m.dashboard_stat_youtube_subscribers(), '123'],
      [m.dashboard_stat_youtube_views(), '4,567'],
      [m.dashboard_stat_blog_total_views(), '1,112'],
      [m.dashboard_stat_blog_total_likes(), '13'],
    ] as const) {
      expect(screen.getByText(label, { selector: 'dt' }).nextElementSibling?.textContent).toBe(value)
    }
  })
})
