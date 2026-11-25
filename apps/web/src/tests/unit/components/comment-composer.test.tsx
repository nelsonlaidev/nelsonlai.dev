import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { CommentComposer } from '@/features/comments/comment-composer'
import { m } from '@/paraglide/messages'

const fixture = vi.hoisted(() => ({
  signedIn: false,
  pending: false,
  create: vi.fn<() => Promise<never>>(),
}))

vi.mock('@repo/auth/client', () => ({
  authClient: {
    useSession: () => ({
      data: fixture.signedIn ? { user: { id: 'local-fixture' } } : null,
      isPending: fixture.pending,
    }),
  },
}))

vi.mock('@/lib/orpc-client', () => ({
  orpc: {
    comments: {
      key: () => ['comments'],
      create: { mutationOptions: (options: object) => ({ ...options, mutationFn: fixture.create }) },
    },
  },
}))

function setup(props: Partial<React.ComponentProps<typeof CommentComposer>> = {}) {
  const client = new QueryClient()

  render(
    <QueryClientProvider client={client}>
      <CommentComposer slug='local-fixture' {...props} />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  fixture.signedIn = false
  fixture.pending = false
  fixture.create.mockReset()
})

describe('Blog comment composer with local session fixtures', () => {
  test('requires sign in and keeps the editor and send action disabled', () => {
    setup()

    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('button', { name: m.common_sign_in() })).toBeEnabled()
    expect(screen.getByRole('button', { name: m.blog_comments_send_comment() })).toBeDisabled()
    expect(fixture.create).not.toHaveBeenCalled()
  })

  test('keeps the composer inaccessible while session resolution is pending', () => {
    fixture.pending = true
    setup()

    expect(screen.getByText(m.common_aria_labels_loading())).toHaveAttribute('skullet-status')
    expect(screen.queryByRole('button', { name: m.common_sign_in() })).not.toBeInTheDocument()
  })

  test('enables editing, formatting and preview for a signed-in user without writing remotely', () => {
    fixture.signedIn = true
    setup()

    expect(screen.getByRole('textbox')).toBeEnabled()
    expect(screen.getByRole('button', { name: m.blog_comments_toggle_bold() })).toBeEnabled()

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '**Local preview**' } })
    expect(screen.getByRole('button', { name: m.blog_comments_send_comment() })).toBeEnabled()

    fireEvent.click(screen.getByRole('tab', { name: m.blog_comments_preview() }))
    expect(screen.getByText('Local preview')).toBeInTheDocument()
    expect(fixture.create).not.toHaveBeenCalled()
  })
})
