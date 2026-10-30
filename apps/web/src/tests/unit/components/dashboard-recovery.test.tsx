import type * as Router from '@tanstack/react-router'

import { QueryClientProvider } from '@tanstack/react-query'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { createQueryClient } from '@/lib/query-client'
import { m } from '@/paraglide/messages'
import { DashboardStats } from '@/routes/_main/-components/dashboard/stats'

const fixture = vi.hoisted(() => ({
  youtube: vi.fn<() => Promise<object>>(),
  toast: vi.fn<(message: { actionProps?: { onClick: () => void } }) => void>(),
}))
vi.mock('@repo/ui/components/toast', () => ({ toast: { add: fixture.toast } }))
function source(name: string, data: object) {
  return {
    queryOptions: (options: object = {}) => ({
      queryKey: [name],
      queryFn: name === 'youtube' ? fixture.youtube : vi.fn<() => Promise<object>>().mockResolvedValue(data),
      ...options,
    }),
  }
}

vi.mock('@/lib/orpc-client', () => {
  return {
    orpc: {
      wakatime: { stats: source('wakatime', { hours: 2345 }) },
      github: { stats: source('github', { stars: 89, followers: 10 }) },
      youtube: { stats: source('youtube', {}) },
      posts: { totals: source('posts', { views: 1112, likes: 13 }) },
    },
  }
})
vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof Router>()),
  Link: (props: { to: string; children: React.ReactNode }) => <a href={props.to}>{props.children}</a>,
}))
vi.mock('@/routes/_main/-components/dashboard/counter', () => ({
  Counter: (props: { value: number }) => <>{props.value}</>,
}))
beforeEach(() => {
  fixture.youtube.mockReset().mockRejectedValue(new Error('Fixture service unavailable'))
  fixture.toast.mockReset()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

describe('Dashboard suspense recovery with real Query and Router boundaries', () => {
  test('retries an initially failed inactive query and restores only its group', async () => {
    const client = createQueryClient()
    client.setDefaultOptions({ queries: { retry: false } })
    const view = render(
      <QueryClientProvider client={client}>
        <DashboardStats />
      </QueryClientProvider>,
    )
    const youtube = screen.getByRole('region', { name: 'YouTube' })
    await waitFor(() => {
      expect(within(youtube).getAllByText(m.dashboard_unavailable())).toHaveLength(2)
    })
    expect(
      client
        .getQueryCache()
        .find({ queryKey: ['youtube'] })
        ?.isActive(),
    ).toBe(false)
    expect(screen.getByText('2345')).toBeInTheDocument()
    expect(screen.getByText('1112')).toBeInTheDocument()
    fixture.youtube.mockResolvedValue({ subscribers: 123, views: 4567 })
    fireEvent.click(within(youtube).getByRole('button', { name: m.common_retry() }))
    expect(await screen.findByText('4567')).toBeInTheDocument()
    expect(within(youtube).queryByText(m.dashboard_unavailable())).not.toBeInTheDocument()
    expect(fixture.youtube).toHaveBeenCalledTimes(2)
    expect(fixture.toast).not.toHaveBeenCalled()
    view.unmount()
    client.clear()
  })

  test('a failed retry stays recoverable for another attempt', async () => {
    const client = createQueryClient()
    client.setDefaultOptions({ queries: { retry: false } })
    const view = render(
      <QueryClientProvider client={client}>
        <DashboardStats />
      </QueryClientProvider>,
    )
    const youtube = screen.getByRole('region', { name: 'YouTube' })
    fireEvent.click(await within(youtube).findByRole('button', { name: m.common_retry() }))
    await waitFor(() => {
      expect(fixture.youtube).toHaveBeenCalledTimes(2)
    })
    fixture.youtube.mockResolvedValue({ subscribers: 123, views: 4567 })
    fireEvent.click(await within(youtube).findByRole('button', { name: m.common_retry() }))
    expect(await screen.findByText('4567')).toBeInTheDocument()
    view.unmount()
    client.clear()
  })
  test('preserves the global toast retry for background errors with cached data', async () => {
    const client = createQueryClient()
    client.setDefaultOptions({ queries: { retry: false } })
    client.setQueryData(['youtube'], { subscribers: 123, views: 4567 })
    const view = render(
      <QueryClientProvider client={client}>
        <DashboardStats />
      </QueryClientProvider>,
    )
    await act(async () => {
      await client.refetchQueries({ queryKey: ['youtube'], exact: true })
    })
    expect(fixture.toast).toHaveBeenCalledOnce()
    expect(screen.getAllByText('4567')).toHaveLength(1)
    fixture.youtube.mockResolvedValue({ subscribers: 124, views: 4568 })
    const message = fixture.toast.mock.calls[0]?.[0]
    if (!message?.actionProps) throw new Error('Expected retry action')
    act(() => {
      message.actionProps?.onClick()
    })
    expect(await screen.findByText('4568')).toBeInTheDocument()
    view.unmount()
    client.clear()
  })
})
