import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { LikeButton, usePostLike } from '@/features/posts/like-button'
import { m } from '@/paraglide/messages'

type CounterProps = {
  value: number
}

type ToastOptions = {
  type: string
  title: string
}

const fixture = vi.hoisted(() => ({
  data: { likes: 12, currentUserLikes: 0 },
  load: vi.fn<
    () => Promise<{
      likes: number
      currentUserLikes: number
    }>
  >(),
  save: vi.fn<
    (input: CounterProps) => Promise<{
      likes: number
      currentUserLikes: number
    }>
  >(),
  toast: vi.fn<(input: ToastOptions) => void>(),
}))
vi.mock('@number-flow/react', () => ({ default: (props: CounterProps) => <span>{props.value}</span> }))
vi.mock('motion/react', () => ({ useReducedMotion: () => true }))
vi.mock('@repo/ui/components/toast', () => ({ toast: { add: fixture.toast } }))
vi.mock('@/lib/orpc-client', () => ({
  orpc: {
    posts: {
      key: () => ['posts'],
      likes: { queryOptions: () => ({ queryKey: ['posts', 'likes'], queryFn: fixture.load }) },
      like: { mutationOptions: (options: object) => ({ ...options, mutationFn: fixture.save }) },
    },
  },
}))

function ArticleLikes() {
  const state = usePostLike('test-article')
  return (
    <>
      <LikeButton state={state} placement='desktop' />
      <LikeButton state={state} placement='mobile' />
    </>
  )
}
function requiredButton(buttons: HTMLElement[], index: number) {
  const button = buttons[index]
  if (!button) throw new Error('Expected a Like control')
  return button
}
function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <ArticleLikes />
    </QueryClientProvider>,
  )
  return client
}

beforeEach(() => {
  fixture.data = { likes: 12, currentUserLikes: 0 }
  fixture.toast.mockReset()
  fixture.load.mockReset().mockResolvedValue(fixture.data)
  fixture.save.mockReset().mockImplementation(async (input: CounterProps) => {
    fixture.data = {
      likes: fixture.data.likes + input.value,
      currentUserLikes: fixture.data.currentUserLikes + input.value,
    }
    fixture.load.mockResolvedValue(fixture.data)
    await Promise.resolve()
    return fixture.data
  })
})

describe('article Like integration with safe query fixtures', () => {
  test('shares drafts across both placements, batches three contributions, and blocks a fourth', async () => {
    setup()
    const buttons = screen.getAllByRole('button', { name: m.blog_like_this_post() })
    await waitFor(() => expect(buttons[0]).toBeEnabled())
    fireEvent.click(requiredButton(buttons, 0))
    fireEvent.click(requiredButton(buttons, 1))
    fireEvent.click(requiredButton(buttons, 0))
    expect(screen.getAllByText('3 / 3')).toHaveLength(2)
    expect(screen.getAllByText('15')).toHaveLength(2)
    fireEvent.click(requiredButton(buttons, 1))
    expect(fixture.toast).toHaveBeenCalledWith({ type: 'error', title: m.error_like_limit_reached() })
    await waitFor(
      () => {
        expect(fixture.save).toHaveBeenCalledWith({ slug: 'test-article', value: 3 }, expect.anything())
      },
      { timeout: 2000 },
    )
    await waitFor(() => expect(buttons[0]).toHaveAttribute('aria-disabled', 'true'))
    expect(screen.getAllByText('15')).toHaveLength(2)
  })
  test('rolls optimistic totals back after a failed request and permits retry', async () => {
    fixture.save.mockRejectedValue(new Error('fixture failure'))
    setup()
    const button = requiredButton(screen.getAllByRole('button', { name: m.blog_like_this_post() }), 0)
    await waitFor(() => expect(button).toBeEnabled())
    fireEvent.click(button)
    expect(screen.getAllByText('13')).toHaveLength(2)
    await waitFor(
      () => {
        expect(fixture.toast).toHaveBeenCalledWith({ type: 'error', title: m.error_something_went_wrong() })
      },
      { timeout: 2000 },
    )
    await waitFor(() => {
      expect(screen.getAllByText('12')).toHaveLength(2)
    })
    expect(screen.getAllByText('0 / 3')).toHaveLength(2)
    expect(button).toBeEnabled()
  })
  test('shows loading and fetch errors without enabling writes', async () => {
    const deferred = Promise.withResolvers<never>()
    fixture.load.mockReturnValue(deferred.promise)
    setup()
    const buttons = screen.getAllByRole('button', { name: m.blog_like_this_post() })
    expect(buttons.every((button) => button.hasAttribute('disabled'))).toBe(true)
    act(() => {
      deferred.reject(new Error('fixture unavailable'))
    })
    await waitFor(() => {
      expect(screen.getAllByText(m.common_error())).toHaveLength(2)
    })
    expect(fixture.save).not.toHaveBeenCalled()
  })
  test('keeps both controls disabled while a contribution is being saved', async () => {
    fixture.save.mockImplementation(async () => new Promise(() => {}))
    setup()
    const buttons = screen.getAllByRole('button', { name: m.blog_like_this_post() })
    await waitFor(() => expect(buttons[0]).toBeEnabled())
    fireEvent.click(requiredButton(buttons, 0))
    await waitFor(
      () => {
        expect(buttons.every((button) => button.hasAttribute('disabled'))).toBe(true)
      },
      { timeout: 2000 },
    )
    fireEvent.click(requiredButton(buttons, 1))
    expect(fixture.save).toHaveBeenCalledTimes(1)
  })
})
