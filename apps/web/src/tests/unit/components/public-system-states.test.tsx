import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { RouteError } from '@/components/route-error'
import { LegalPending } from '@/features/legal/legal-page'
import { UnsubscribePage } from '@/features/notifications/unsubscribe-page'
import { m } from '@/paraglide/messages'

const fixture = vi.hoisted(() => ({
  invalidate: vi.fn<() => Promise<void>>(),
  reset: vi.fn<() => void>(),
  inspect: vi.fn<() => Promise<{ comment: string; userEmail: string; isUnsubscribed: boolean }>>(),
  unsubscribe: vi.fn<() => Promise<void>>(),
}))
vi.mock('@tanstack/react-router', () => ({
  Link: (props: { children: React.ReactNode; to: string }) => <a href={props.to}>{props.children}</a>,
  useRouter: () => ({ invalidate: fixture.invalidate }),
}))
vi.mock('@/components/main-layout', () => ({
  MainLayout: (props: { children: React.ReactNode }) => <main>{props.children}</main>,
}))
vi.mock('@/components/mdx/mdx', () => ({ Mdx: () => null }))
vi.mock('@/lib/orpc-client', async () => {
  const { createTanstackQueryUtils } = await import('@orpc/tanstack-query')
  return {
    orpc: createTanstackQueryUtils({
      notifications: {
        inspectUnsubscribe: fixture.inspect,
        unsubscribe: fixture.unsubscribe,
      },
    }),
  }
})

function setup(token?: string) {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <UnsubscribePage token={token} />
    </QueryClientProvider>,
  )
}
beforeEach(() => {
  fixture.invalidate.mockReset().mockResolvedValue()
  fixture.reset.mockReset()
  fixture.inspect.mockReset()
  fixture.unsubscribe.mockReset()
  fixture.inspect.mockResolvedValue({
    comment: 'Local fixture comment',
    userEmail: 'fixture@example.invalid',
    isUnsubscribed: false,
  })
  fixture.unsubscribe.mockResolvedValue()
})

describe('Public system states with isolated API fixtures', () => {
  test('missing token stays invalid and never inspects or writes', () => {
    setup()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(m.unsubscribe_invalid_unsubscribe_link())
    expect(fixture.inspect).not.toHaveBeenCalled()
    expect(fixture.unsubscribe).not.toHaveBeenCalled()
  })
  test('inspection error never offers an unsubscribe action', async () => {
    fixture.inspect.mockRejectedValue(new Error('Fixture invalid token'))
    setup('local-fixture')
    await screen.findByText(m.unsubscribe_invalid_unsubscribe_link())
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(fixture.unsubscribe).not.toHaveBeenCalled()
  })
  test('loading remains busy without showing a success message', () => {
    fixture.inspect.mockReturnValue(new Promise(() => {}))
    const view = setup('local-fixture')
    expect(view.container.querySelector('[aria-busy]')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('heading')).toHaveTextContent(m.common_loading())
    expect(screen.queryByText(m.unsubscribe_you_have_been_unsubscribed())).not.toBeInTheDocument()
  })
  test('confirmation requires an explicit click and updates the cached result', async () => {
    setup('local-fixture')
    const button = await screen.findByRole('button', { name: m.common_labels_unsubscribe() })
    expect(screen.getByText('Local fixture comment')).toBeInTheDocument()
    expect(fixture.unsubscribe).not.toHaveBeenCalled()
    fireEvent.click(button)
    await screen.findByText(m.unsubscribe_you_have_been_unsubscribed())
    expect(fixture.unsubscribe).toHaveBeenCalledOnce()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
  test('existing unsubscribe result needs no mutation', async () => {
    fixture.inspect.mockResolvedValue({ comment: '', userEmail: 'fixture@example.invalid', isUnsubscribed: true })
    setup('local-fixture')
    await screen.findByText(m.unsubscribe_you_have_been_unsubscribed())
    expect(fixture.unsubscribe).not.toHaveBeenCalled()
  })
  test('failed mutation announces the error and keeps confirmation available', async () => {
    fixture.unsubscribe.mockRejectedValue(new Error('Fixture write failure'))
    setup('local-fixture')
    fireEvent.click(await screen.findByRole('button', { name: m.common_labels_unsubscribe() }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(m.error_something_went_wrong()))
    expect(screen.getByRole('button', { name: m.common_labels_unsubscribe() })).toBeEnabled()
    expect(screen.queryByText(m.unsubscribe_you_have_been_unsubscribed())).not.toBeInTheDocument()
  })
  test('route error retries the router before resetting its boundary', async () => {
    render(<RouteError error={new Error('Local fixture')} reset={fixture.reset} info={{ componentStack: '' }} />)
    fireEvent.click(screen.getByRole('button', { name: m.error_try_again() }))
    await waitFor(() => {
      expect(fixture.reset).toHaveBeenCalledOnce()
    })
    expect(fixture.invalidate).toHaveBeenCalledOnce()
    expect(fixture.invalidate.mock.invocationCallOrder[0]).toBeLessThan(
      fixture.reset.mock.invocationCallOrder[0] ?? Infinity,
    )
  })
  test('legal pending view announces loading', () => {
    render(<LegalPending />)
    expect(screen.getByRole('status')).toHaveTextContent(m.common_loading())
  })
})
