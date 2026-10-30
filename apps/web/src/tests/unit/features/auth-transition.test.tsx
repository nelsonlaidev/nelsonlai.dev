import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { ActiveSessions } from '@/features/account/active-sessions'
import { useSignOut } from '@/features/auth/use-sign-out'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

const fixture = vi.hoisted(() => ({
  signOut: vi.fn<() => Promise<{ error: { message: string } | null }>>(),
  refresh: vi.fn<() => Promise<void>>(),
  invalidate: vi.fn<() => Promise<void>>(),
  sessions: vi.fn<() => Promise<object[]>>(),
  revoke: vi.fn<() => Promise<{ isCurrentSession: boolean }>>(),
  toast: vi.fn<(message: { type: string; title: string }) => void>(),
}))
vi.mock('@/lib/auth-client', () => ({
  authClient: { signOut: fixture.signOut, useSession: () => ({ refetch: fixture.refresh }) },
}))
vi.mock('@/hooks/use-formatted-date', () => ({ useFormattedDate: () => 'Fixture date' }))
vi.mock('@repo/ui/components/toast', () => ({ toast: { add: fixture.toast } }))
vi.mock('@tanstack/react-router', () => ({ useRouter: () => ({ invalidate: fixture.invalidate }) }))
vi.mock('@/lib/orpc-client', async () => {
  const { createTanstackQueryUtils } = await import('@orpc/tanstack-query')
  return {
    orpc: createTanstackQueryUtils({
      account: {
        listSessions: fixture.sessions,
        revokeSession: fixture.revoke,
      },
      admin: { stats: vi.fn<() => Promise<object>>().mockResolvedValue({ users: 5 }) },
      notifications: { getPreference: vi.fn<() => Promise<object>>().mockResolvedValue({ repliesEnabled: true }) },
      posts: { totals: vi.fn<() => Promise<object>>().mockResolvedValue({ views: 100, likes: 13 }) },
    }),
  }
})
function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const accountKey = [...orpc.account.listSessions.key(), { userId: 'reader' }]
  const preferenceKey = [...orpc.notifications.getPreference.key(), { userId: 'reader' }]
  const adminKey = orpc.admin.stats.queryKey()
  const publicKey = orpc.posts.totals.queryKey()
  for (const key of [accountKey, preferenceKey, adminKey]) client.setQueryData(key, 'private')
  client.setQueryData(publicKey, { views: 100, likes: 13 })
  function Wrapper(props: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
  }
  return { client, accountKey, preferenceKey, adminKey, publicKey, Wrapper }
}
beforeEach(() => {
  vi.resetAllMocks()
  fixture.sessions.mockResolvedValue([
    {
      id: 'current',
      isCurrentSession: true,
      updatedAt: new Date('2026-01-01'),
      userAgent: null,
      ipAddress: null,
      location: null,
    },
  ])
  fixture.signOut.mockResolvedValue({ error: null })
  fixture.refresh.mockResolvedValue()
  fixture.invalidate.mockResolvedValue()
  fixture.revoke.mockResolvedValue({ isCurrentSession: true })
})
describe('successful session endings', () => {
  test('sign-out removes private data, cancels late results and revalidates routes while keeping public data', async () => {
    const { client, Wrapper, accountKey, preferenceKey, adminKey, publicKey } = setup()
    const request = Promise.withResolvers<string>()
    const pending = (async () => {
      try {
        await client.query({ queryKey: adminKey, queryFn: async () => request.promise, staleTime: 0 })
      } catch {
        // Session ending cancels this deliberately unresolved request.
      }
    })()
    const { result, unmount } = renderHook(useSignOut, { wrapper: Wrapper })
    await act(async () => {
      expect(await result.current.signOut()).toBe(true)
    })
    request.resolve('late private result')
    await pending
    for (const key of [accountKey, preferenceKey, adminKey]) expect(client.getQueryData(key)).toBeUndefined()
    expect(client.getQueryData(publicKey)).toEqual({ views: 100, likes: 13 })
    expect(fixture.refresh).toHaveBeenCalledOnce()
    expect(fixture.invalidate).toHaveBeenCalledOnce()
    unmount()
    client.clear()
  })

  test.each(['returned', 'thrown'])('a %s sign-out error leaves the current cache and guards intact', async (kind) => {
    const { client, Wrapper, accountKey } = setup()
    if (kind === 'returned') fixture.signOut.mockResolvedValue({ error: { message: 'Denied fixture' } })
    else fixture.signOut.mockRejectedValue(new Error('Offline fixture'))
    const { result, unmount } = renderHook(useSignOut, { wrapper: Wrapper })
    await act(async () => {
      expect(await result.current.signOut()).toBe(false)
    })
    expect(client.getQueryData(accountKey)).toBe('private')
    expect(fixture.refresh).not.toHaveBeenCalled()
    expect(fixture.invalidate).not.toHaveBeenCalled()
    expect(result.current.isSigningOut).toBe(false)
    unmount()
    client.clear()
  })

  test('ignores duplicate submission while the request is pending', async () => {
    const { client, Wrapper } = setup()
    const request = Promise.withResolvers<{ error: null }>()
    fixture.signOut.mockReturnValue(request.promise)
    const { result, unmount } = renderHook(useSignOut, { wrapper: Wrapper })
    await act(async () => {
      const first = result.current.signOut()
      expect(await result.current.signOut()).toBe(false)
      request.resolve({ error: null })
      expect(await first).toBe(true)
    })
    expect(fixture.signOut).toHaveBeenCalledOnce()
    unmount()
    client.clear()
  })

  test('still clears racing private queries and revalidates guards if session refresh fails', async () => {
    const { client, Wrapper, adminKey } = setup()
    fixture.refresh.mockImplementation(() => {
      client.setQueryData(adminKey, { totalUsers: 1, totalComments: 2, totalMessages: 3, totalViews: 4, totalLikes: 5 })
      throw new Error('Refresh fixture failure')
    })
    const { result, unmount } = renderHook(useSignOut, { wrapper: Wrapper })
    await act(async () => {
      expect(await result.current.signOut()).toBe(true)
    })
    expect(fixture.invalidate).toHaveBeenCalledOnce()
    expect(client.getQueryData(adminKey)).toBeUndefined()
    expect(fixture.toast).not.toHaveBeenCalledWith({ type: 'error', title: m.error_sign_out_failed() })
    unmount()
    client.clear()
  })

  test('does not undo a successful sign-out when router revalidation fails', async () => {
    const { client, Wrapper, accountKey, adminKey } = setup()
    fixture.invalidate.mockRejectedValue(new Error('Guard request failed'))
    const { result, unmount } = renderHook(useSignOut, { wrapper: Wrapper })
    await act(async () => {
      expect(await result.current.signOut()).toBe(true)
    })
    expect(client.getQueryData(accountKey)).toBeUndefined()
    expect(client.getQueryData(adminKey)).toBeUndefined()
    expect(result.current.isSigningOut).toBe(false)
    expect(fixture.toast).toHaveBeenCalledExactlyOnceWith({ type: 'error', title: m.error_something_went_wrong() })
    unmount()
    client.clear()
  })

  test.each([true, false])(
    'current-session revocation=%s applies the appropriate cache lifecycle',
    async (isCurrentSession) => {
      const { client, Wrapper, adminKey, preferenceKey, publicKey } = setup()
      client.removeQueries({ queryKey: orpc.account.key() })
      fixture.revoke.mockResolvedValue({ isCurrentSession })
      const view = render(<ActiveSessions userId='reader' />, { wrapper: Wrapper })
      fireEvent.click(await screen.findByRole('button', { name: m.account_revoke_session() }))
      await waitFor(() => {
        expect(fixture.revoke).toHaveBeenCalledOnce()
      })
      await waitFor(() => {
        expect(screen.getByRole('button', { name: m.account_revoke_session() })).toBeEnabled()
      })
      expect(fixture.invalidate).toHaveBeenCalledTimes(isCurrentSession ? 1 : 0)
      expect(fixture.refresh).toHaveBeenCalledTimes(isCurrentSession ? 1 : 0)
      const expectedPrivateData = isCurrentSession ? undefined : 'private'
      expect(client.getQueryData(adminKey)).toBe(expectedPrivateData)
      expect(client.getQueryData(preferenceKey)).toBe(expectedPrivateData)
      expect(client.getQueryData(publicKey)).toEqual({ views: 100, likes: 13 })
      view.unmount()
      client.clear()
    },
  )
})
