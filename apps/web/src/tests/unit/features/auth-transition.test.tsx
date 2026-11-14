import { UIProvider } from '@repo/ui/components/ui-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { IntlProvider } from 'use-intl'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { ActiveSessions } from '@/features/account/active-sessions'
import { useSignOut } from '@/features/auth/use-sign-out'
import { m } from '@/paraglide/messages'

type ToastOptions = {
  type: string
  title: string
}

type ChildrenProps = {
  children: React.ReactNode
}

const fixture = vi.hoisted(() => ({
  signOut: vi.fn<
    () => Promise<{
      error: {
        message: string
      } | null
    }>
  >(),
  reload: vi.fn<() => void>(),
  sessions: vi.fn<() => Promise<object[]>>(),
  revoke: vi.fn<
    () => Promise<{
      isCurrentSession: boolean
    }>
  >(),
  toast: vi.fn<(message: ToastOptions) => void>(),
}))
vi.mock('@/lib/auth-client', () => ({
  authClient: { signOut: fixture.signOut },
}))
vi.mock('@/hooks/use-formatted-date', () => ({ useFormattedDate: () => 'Fixture date' }))
vi.mock('@repo/ui/components/toast', () => ({ toast: { add: fixture.toast } }))
vi.mock('@/lib/orpc-client', async () => {
  const { createTanstackQueryUtils } = await import('@orpc/tanstack-query')
  return {
    client: { account: { revokeSession: fixture.revoke } },
    orpc: createTanstackQueryUtils({
      account: {
        listSessions: fixture.sessions,
        revokeSession: fixture.revoke,
      },
    }),
  }
})
function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  function Wrapper(props: ChildrenProps) {
    return (
      <IntlProvider locale='en'>
        <UIProvider
          translations={{
            loading: m.common_aria_labels_loading(),
            close: m.common_labels_close(),
            commandDialogTitle: m.command_menu_title(),
            commandDialogDescription: m.command_menu_description(),
            treeView: m.common_aria_labels_tree_view(),
            sidebarTitle: m.admin_sidebar_title(),
            sidebarDescription: m.admin_sidebar_description(),
            toggleSidebar: m.common_aria_labels_toggle_sidebar(),
          }}
        >
          <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
        </UIProvider>
      </IntlProvider>
    )
  }
  return { client, Wrapper }
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
  vi.stubGlobal('location', {
    href: globalThis.location.href,
    origin: globalThis.location.origin,
    reload: fixture.reload,
  })
  fixture.revoke.mockResolvedValue({ isCurrentSession: true })
})
afterEach(() => vi.unstubAllGlobals())

describe('session endings', () => {
  test('reloads the page after successful sign-out', async () => {
    const { result, unmount } = renderHook(useSignOut)
    await act(async () => {
      expect(await result.current.signOut()).toBe(true)
    })
    expect(fixture.reload).toHaveBeenCalledOnce()
    expect(fixture.toast).toHaveBeenCalledExactlyOnceWith({ type: 'success', title: m.success_signed_out() })
    unmount()
  })

  test.each(['returned', 'thrown'])('a %s sign-out error does not reload the page', async (kind) => {
    if (kind === 'returned') fixture.signOut.mockResolvedValue({ error: { message: 'Denied fixture' } })
    else fixture.signOut.mockRejectedValue(new Error('Offline fixture'))
    const { result, unmount } = renderHook(useSignOut)
    await act(async () => {
      expect(await result.current.signOut()).toBe(false)
    })
    expect(fixture.reload).not.toHaveBeenCalled()
    expect(result.current.isSigningOut).toBe(false)
    unmount()
  })

  test('ignores duplicate submission while the request is pending', async () => {
    const request = Promise.withResolvers<{
      error: null
    }>()
    fixture.signOut.mockReturnValue(request.promise)
    const { result, unmount } = renderHook(useSignOut)
    await act(async () => {
      const first = result.current.signOut()
      expect(await result.current.signOut()).toBe(false)
      request.resolve({ error: null })
      expect(await first).toBe(true)
    })
    expect(fixture.signOut).toHaveBeenCalledOnce()
    unmount()
  })

  test.each([true, false])(
    'current-session revocation=%s reloads only the current session',
    async (isCurrentSession) => {
      const { client, Wrapper } = setup()
      fixture.sessions.mockResolvedValue([
        {
          id: 'target',
          isCurrentSession,
          updatedAt: new Date('2026-01-01'),
          userAgent: null,
          ipAddress: null,
          location: null,
        },
      ])
      fixture.revoke.mockResolvedValue({ isCurrentSession })
      const view = render(<ActiveSessions userId='reader' />, { wrapper: Wrapper })
      fireEvent.click(await screen.findByRole('button', { name: m.account_revoke_session() }))
      await waitFor(() => {
        expect(isCurrentSession ? fixture.signOut : fixture.revoke).toHaveBeenCalledOnce()
      })
      await waitFor(() => {
        expect(screen.getByRole('button', { name: m.account_revoke_session() })).toBeEnabled()
      })
      expect(fixture.reload).toHaveBeenCalledTimes(isCurrentSession ? 1 : 0)
      expect(fixture.signOut).toHaveBeenCalledTimes(isCurrentSession ? 1 : 0)
      expect(fixture.revoke).toHaveBeenCalledTimes(isCurrentSession ? 0 : 1)
      expect(fixture.toast).toHaveBeenCalledExactlyOnceWith({ type: 'success', title: m.success_session_revoked() })
      view.unmount()
      client.clear()
    },
  )
})
