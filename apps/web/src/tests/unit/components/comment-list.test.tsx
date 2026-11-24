import type * as ReactQuery from '@tanstack/react-query'

import { UIProvider } from '@repo/ui/components/ui-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { IntlProvider } from 'use-intl'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { CommentList } from '@/features/comments/comment-list'
import { m } from '@/paraglide/messages'

type ChildrenProps = {
  children: React.ReactNode
}

const fixture = vi.hoisted(() => ({ state: 'loading' as 'loading' | 'empty' | 'error' }))

vi.mock('@repo/auth/client', () => ({ authClient: { useSession: () => ({ data: null, isPending: false }) } }))
vi.mock('@/features/comments/comments.queries', () => ({ commentListInfiniteOptions: () => ({}) }))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useInfiniteQuery: () => ({
    hasNextPage: false,
    isFetching: false,
    isFetchingNextPage: false,
    isPending: fixture.state === 'loading',
    isError: fixture.state === 'error',
    isSuccess: fixture.state === 'empty',
    data: fixture.state === 'empty' ? { pages: [{ comments: [] }] } : undefined,
  }),
}))

function Labels(props: ChildrenProps) {
  return (
    <UIProvider
      translations={{
        loading: m.common_aria_labels_loading(),
        close: m.common_labels_close(),
        treeView: m.common_aria_labels_tree_view(),
        sidebarTitle: m.admin_sidebar_title(),
        sidebarDescription: m.admin_sidebar_description(),
        toggleSidebar: m.common_aria_labels_toggle_sidebar(),
      }}
    >
      <IntlProvider
        locale='en'
        formats={{ dateTime: { short: { dateStyle: 'short' }, long: { dateStyle: 'medium' } } }}
      >
        <QueryClientProvider client={new QueryClient()}>{props.children}</QueryClientProvider>
      </IntlProvider>
    </UIProvider>
  )
}

beforeEach(() => {
  fixture.state = 'loading'
})

describe('Blog comment read states using local query fixtures', () => {
  test('announces loading while comments are pending', () => {
    render(<CommentList slug='local-fixture' sort='newest' />, { wrapper: Labels })

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByText(m.blog_comments_no_comments())).not.toBeInTheDocument()
  })

  test('renders an empty discussion without sample comments', () => {
    fixture.state = 'empty'
    render(<CommentList slug='local-fixture' sort='oldest' />, { wrapper: Labels })

    expect(screen.getByText(m.blog_comments_no_comments())).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  test('announces failures for both comments and nested replies', () => {
    fixture.state = 'error'
    const view = render(<CommentList slug='local-fixture' sort='newest' />, { wrapper: Labels })

    expect(screen.getByRole('alert')).toHaveTextContent(m.error_failed_to_load_comments())

    view.rerender(<CommentList slug='local-fixture' sort='newest' parentId='fixture-parent' />)
    expect(screen.getByRole('alert')).toHaveTextContent(m.error_failed_to_load_replies())
  })
})
