import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { IntlProvider } from 'use-intl'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { ActiveSessions } from '@/features/account/active-sessions'
import { NotificationSettings } from '@/features/account/notification-settings'
import { AdminComments } from '@/features/admin/admin-comments'
import { AdminUsers } from '@/features/admin/admin-users'
import { m } from '@/paraglide/messages'
import { setLocale } from '@/paraglide/runtime'

const fixture = vi.hoisted(() => ({
  users: vi.fn<() => Promise<object>>(),
  comments: vi.fn<() => Promise<object>>(),
  sessions: vi.fn<() => Promise<object[]>>(),
  preference: vi.fn<() => Promise<{ repliesEnabled: boolean }>>(),
  mutate: vi.fn<() => Promise<never>>(),
}))
vi.mock('@tanstack/react-router', () => ({
  Link: (props: { children: React.ReactNode; to: string }) => <a href={props.to}>{props.children}</a>,
  useRouter: () => ({ invalidate: vi.fn<() => Promise<void>>() }),
}))
vi.mock('@/lib/auth-client', () => ({ authClient: { useSession: () => ({ refetch: vi.fn<() => Promise<void>>() }) } }))
function query(key: string, queryFn: () => Promise<unknown>) {
  return {
    key: () => [key],
    queryOptions: (options: object = {}) => ({ queryKey: [key], queryFn, ...options }),
  }
}

vi.mock('@/lib/orpc-client', () => {
  const mutation = { mutationOptions: (options: object) => ({ ...options, mutationFn: fixture.mutate }) }
  return {
    orpc: {
      admin: {
        user: { list: query('users', fixture.users) },
        comment: { list: query('comments', fixture.comments) },
      },
      account: { listSessions: query('sessions', fixture.sessions), revokeSession: mutation },
      notifications: { getPreference: query('preference', fixture.preference), setPreference: mutation },
    },
  }
})
function setup(children: React.ReactNode) {
  return render(
    <IntlProvider locale='en' formats={{ dateTime: { long: { dateStyle: 'medium', timeStyle: 'short' } } }}>
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        {children}
      </QueryClientProvider>
    </IntlProvider>,
  )
}
beforeEach(async () => {
  await setLocale('en', { reload: false })
  vi.resetAllMocks()
  fixture.users.mockResolvedValue({ users: [], pageCount: 0 })
  fixture.comments.mockResolvedValue({ comments: [], pageCount: 0 })
  fixture.sessions.mockResolvedValue([])
  fixture.preference.mockResolvedValue({ repliesEnabled: true })
})
describe('Account and admin presentation with isolated API fixtures', () => {
  test.each(['en', 'zh-TW', 'zh-CN', 'ja', 'es', 'pt-BR'] as const)('localizes empty tables in %s', async (locale) => {
    await setLocale(locale, { reload: false })
    setup(<AdminUsers />)
    expect(await screen.findByText(m.components_tables_users_empty())).toBeInTheDocument()
    expect(screen.getByRole('table', { name: m.common_labels_users() })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: m.components_table_pagination_go_to_next_page() })).toBeDisabled()
    expect(fixture.mutate).not.toHaveBeenCalled()
  })
  test('announces admin loading while no rows are available', () => {
    fixture.users.mockReturnValue(new Promise(() => {}))
    setup(<AdminUsers />)
    expect(screen.getByRole('status')).toHaveTextContent(m.common_loading())
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
  test('announces an admin request error', async () => {
    fixture.comments.mockRejectedValue(new Error('Local fixture failure'))
    setup(<AdminComments />)
    expect(await screen.findByRole('alert')).toHaveTextContent(m.error_failed_to_fetch_comments_data())
  })
  test('retains comment bodies and links in the comments table', async () => {
    fixture.comments.mockResolvedValue({
      comments: [
        {
          id: 'fixture-comment',
          userId: null,
          parentId: null,
          body: 'Local fixture body',
          postId: 'example',
          createdAt: new Date('2026-01-01'),
          user: { id: 'deleted', name: 'Fixture reader', image: null },
        },
      ],
      pageCount: 1,
    })
    setup(<AdminComments />)
    expect(await screen.findByText('Local fixture body')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'example' })).toBeInTheDocument()
  })
  test('empty sessions never offers a revoke action', async () => {
    setup(<ActiveSessions userId='local-fixture' />)
    expect(await screen.findByText(m.account_no_active_sessions())).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(fixture.mutate).not.toHaveBeenCalled()
  })
  test('session failures are announced without suggesting there are no sessions', async () => {
    fixture.sessions.mockRejectedValue(new Error('Local fixture failure'))
    setup(<ActiveSessions userId='local-fixture' />)
    expect(await screen.findByRole('alert')).toHaveTextContent(m.error_something_went_wrong())
    expect(screen.queryByText(m.account_no_active_sessions())).not.toBeInTheDocument()
  })
  test('notification toggling and reset remain local until saved', async () => {
    setup(<NotificationSettings userId='local-fixture' />)
    const toggle = await screen.findByRole('switch')
    expect(screen.getByRole('button', { name: m.common_save() })).toBeDisabled()
    fireEvent.click(toggle)
    expect(screen.getByRole('button', { name: m.common_save() })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: m.common_reset() }))
    expect(toggle).toBeChecked()
    expect(screen.getByRole('button', { name: m.common_save() })).toBeDisabled()
    expect(fixture.mutate).not.toHaveBeenCalled()
  })
})
