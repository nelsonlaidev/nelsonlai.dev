import type * as ReactQuery from '@tanstack/react-query'

import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { Messages } from '@/features/guestbook/messages'
import { m } from '@/paraglide/messages'

const fixture = vi.hoisted(() => ({
  state: 'loading',
  next: vi.fn<() => void>(),
  retry: vi.fn<() => void>(),
  more: false,
}))

vi.mock('@/features/guestbook/guestbook.queries', () => ({ guestbookMessagesInfiniteOptions: {} }))
vi.mock('@/hooks/use-formatted-date', () => ({ useFormattedDate: () => 'January 1, 2026' }))
vi.mock('@/components/user-avatar', () => ({ UserAvatar: () => null }))

vi.mock('@/features/guestbook/delete-button', () => ({
  DeleteButton: () => <button type='button'>Delete fixture</button>,
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useInfiniteQuery: () => ({
    hasNextPage: fixture.more,
    isFetching: false,
    isFetchingNextPage: false,
    isPending: fixture.state === 'loading',
    isError: fixture.state === 'error',
    isLoadingError: fixture.state === 'error',
    isSuccess: ['empty', 'success'].includes(fixture.state),
    fetchNextPage: fixture.next,
    refetch: fixture.retry,
    data:
      fixture.state === 'loading' || fixture.state === 'error'
        ? undefined
        : {
            pages: [
              {
                messages:
                  fixture.state === 'empty'
                    ? []
                    : [
                        {
                          id: 'fixture',
                          body: 'A safe local thought\nAnother line',
                          userId: 'local-author',
                          user: { id: 'local-author', name: 'Local diver', image: null },
                          createdAt: new Date('2026-01-01'),
                        },
                      ],
              },
            ],
          },
  }),
}))

beforeEach(() => {
  fixture.state = 'loading'
  fixture.more = false
  fixture.next.mockReset()
  fixture.retry.mockReset()
})

describe('Guestbook read states with local query fixtures', () => {
  test('provides a skeleton label for pending reads', () => {
    render(<Messages />)

    expect(screen.getByText(m.common_aria_labels_loading())).toHaveAttribute('skullet-status')
    expect(screen.queryByText(m.guestbook_no_messages())).not.toBeInTheDocument()
  })

  test('shows an honest empty state', () => {
    fixture.state = 'empty'
    render(<Messages />)

    expect(screen.getByText(m.guestbook_no_messages())).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  test('announces failure and supports retry', () => {
    fixture.state = 'error'
    render(<Messages />)

    expect(screen.getByRole('alert')).toHaveTextContent(m.error_failed_to_load_messages())

    fireEvent.click(screen.getByRole('button', { name: m.common_retry() }))
    expect(fixture.retry).toHaveBeenCalledOnce()
  })

  test('shows author delete only for the signed-in author', () => {
    fixture.state = 'success'
    const view = render(<Messages userId='other' />)

    expect(screen.getByRole('article')).toHaveTextContent('A safe local thought')
    expect(view.container.querySelector('time')).toHaveAttribute('datetime', '2026-01-01T00:00:00.000Z')
    expect(screen.queryByRole('button', { name: 'Delete fixture' })).not.toBeInTheDocument()

    view.rerender(<Messages userId='local-author' />)
    expect(screen.getByRole('button', { name: 'Delete fixture' })).toBeInTheDocument()
  })

  test('provides keyboard-accessible pagination as well as the observer', () => {
    fixture.state = 'empty'
    fixture.more = true

    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        disconnect() {}
      },
    )

    render(<Messages />)
    fireEvent.click(screen.getByRole('button', { name: m.common_load_more() }))
    expect(fixture.next).toHaveBeenCalledOnce()

    vi.unstubAllGlobals()
  })
})
