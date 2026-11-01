import type * as ReactQuery from '@tanstack/react-query'
import type * as Router from '@tanstack/react-router'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { m } from '@/paraglide/messages'
import { DashboardStats } from '@/routes/_main/-components/dashboard/stats'

type MockLinkProps = {
  to: string
  children: React.ReactNode
}

type SourceProps = {
  source: string
}

type CounterProps = {
  value: number
}

const fixture = vi.hoisted(() => ({ failed: '', queries: vi.fn<(options: unknown) => void>() }))
vi.mock('@/lib/orpc-client', () => ({
  orpc: {
    wakatime: { stats: { queryOptions: (options: object) => ({ source: 'wakatime', ...options }) } },
    youtube: { stats: { queryOptions: (options: object) => ({ source: 'youtube', ...options }) } },
    github: { stats: { queryOptions: (options: object) => ({ source: 'github', ...options }) } },
    posts: { totals: { queryOptions: (options: object) => ({ source: 'posts', ...options }) } },
  },
}))
vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof Router>()),
  Link: (props: MockLinkProps) => <a href={props.to}>{props.children}</a>,
}))
vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useSuspenseQuery: (options: SourceProps) => {
    fixture.queries(options)
    if (options.source === fixture.failed) throw new Error('Local service error')
    const values: Record<string, object> = {
      wakatime: { hours: 2345 },
      youtube: { subscribers: 123, views: 4567 },
      github: { stars: 89, followers: 10 },
      posts: { views: 1112, likes: 13 },
    }
    return { data: values[options.source] }
  },
}))
vi.mock('@/routes/_main/-components/dashboard/counter', () => ({
  Counter: (props: CounterProps) => <>{new Intl.NumberFormat('en').format(props.value)}</>,
}))
beforeEach(() => {
  fixture.failed = ''
  fixture.queries.mockReset()
})

describe('Dashboard service mapping', () => {
  test('maps all seven service fields in Seafold group order', () => {
    const view = render(<DashboardStats />)
    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      m.dashboard_coding(),
      'GitHub',
      'YouTube',
      m.dashboard_blog(),
    ])
    const values = [...view.container.querySelectorAll('dd')].map((value) => value.textContent)
    expect(values).toEqual(['2,345hrs', '89', '10', '123', '4,567', '1,112', '13'])
    expect(screen.getByRole('link', { name: m.projects_read_blog() })).toHaveAttribute('href', '/blog')
    for (const source of ['wakatime', 'github', 'youtube'])
      expect(fixture.queries).toHaveBeenCalledWith({
        source,
        refetchOnWindowFocus: false,
        meta: { errorHandledLocally: true },
      })
    expect(fixture.queries).toHaveBeenCalledWith({ source: 'posts', meta: { errorHandledLocally: true } })
  })
  test('isolates a failed service without hiding the other totals', () => {
    fixture.failed = 'youtube'
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<DashboardStats />)
    expect(screen.getAllByText(m.dashboard_unavailable())).toHaveLength(2)
    expect(screen.getByText('2,345')).toBeInTheDocument()
    expect(screen.getByText('1,112')).toBeInTheDocument()
    log.mockRestore()
  })
})
