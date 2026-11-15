import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { MessageBoard } from '@/features/guestbook/message-board'
import { MessageBox } from '@/features/guestbook/message-box'
import { m } from '@/paraglide/messages'

type ChildrenProps = {
  children: React.ReactNode
}

const fixture = vi.hoisted(() => ({
  signedIn: false,
  pending: false,
  create: vi.fn<() => Promise<unknown>>(),
  toast: vi.fn<(options: unknown) => void>(),
}))
vi.mock('@repo/auth/client', () => ({
  authClient: {
    useSession: () => ({
      isPending: fixture.pending,
      data: fixture.signedIn ? { user: { id: 'local', name: 'Local diver', image: null } } : null,
    }),
  },
}))
vi.mock('@/features/auth/use-sign-out', () => ({
  useSignOut: () => ({ isSigningOut: false, signOut: async () => {} }),
}))
vi.mock('@/features/guestbook/messages', () => ({ Messages: () => null }))
vi.mock('@/features/guestbook/sign-in', () => ({ SignIn: () => <button type='button'>Fixture sign in</button> }))
vi.mock('@/components/user-avatar', () => ({ UserAvatar: () => null }))
vi.mock('@repo/ui/components/toast', () => ({ toast: { add: fixture.toast } }))
vi.mock('@/lib/orpc-client', () => ({
  orpc: {
    guestbook: {
      list: { key: () => ['local-guestbook'] },
      create: { mutationOptions: (options: object) => ({ ...options, mutationFn: fixture.create }) },
    },
  },
}))

function Wrapper(props: ChildrenProps) {
  return <QueryClientProvider client={new QueryClient()}>{props.children}</QueryClientProvider>
}
function setup(isSigningOut = false) {
  // Session fields outside the composer contract are never read in this fixture.
  return render(
    <MessageBox
      user={{
        id: 'local',
        name: 'Local diver',
        email: 'local@example.invalid',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'user',
        banned: false,
        image: null,
      }}
      isSigningOut={isSigningOut}
      onSignOut={async () => {}}
    />,
    { wrapper: Wrapper },
  )
}
beforeEach(() => {
  fixture.signedIn = false
  fixture.pending = false
  fixture.create.mockReset()
  fixture.toast.mockReset()
})

describe('Guestbook session and submission fixtures', () => {
  test('shows the sign-in gate while unauthenticated', () => {
    render(<MessageBoard />, { wrapper: Wrapper })
    expect(screen.getByRole('button', { name: 'Fixture sign in' })).toBeEnabled()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
  test('shows the authenticated composer without writing', () => {
    fixture.signedIn = true
    render(<MessageBoard />, { wrapper: Wrapper })
    expect(screen.getByRole('textbox')).toBeEnabled()
    expect(fixture.create).not.toHaveBeenCalled()
  })
  test('provides a skeleton label for a resolving session', () => {
    fixture.pending = true
    render(<MessageBoard />, { wrapper: Wrapper })
    expect(screen.getByText(m.common_aria_labels_loading())).toHaveAttribute('skullet-status')
    expect(screen.queryByRole('button', { name: 'Fixture sign in' })).not.toBeInTheDocument()
  })
  test('keeps the full server-supported length instead of the prototype limit', () => {
    setup()
    expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '2000')
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'x'.repeat(281) } })
    expect(screen.getByText('281/2000')).toBeInTheDocument()
    expect(fixture.create).not.toHaveBeenCalled()
  })
  test('locks the editor and actions during submission and resets on success locally', async () => {
    let finish: ((value: unknown) => void) | undefined
    fixture.create.mockImplementation(
      async () =>
        new Promise((resolve) => {
          finish = resolve
        }),
    )
    setup()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Local fixture only' } })
    fireEvent.click(screen.getByRole('button', { name: m.guestbook_message_submit() }))
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeDisabled()
    })
    expect(screen.getByRole('button', { name: m.common_sign_out() })).toBeDisabled()
    finish?.({})
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('')
    })
    expect(fixture.create).toHaveBeenCalledOnce()
    expect(fixture.toast).toHaveBeenCalledWith({ type: 'success', title: m.success_message_created() })
  })
  test('keeps the draft and announces a failed local write', async () => {
    fixture.create.mockRejectedValue(new Error('Local fixture failure'))
    setup()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Keep this draft' } })
    fireEvent.click(screen.getByRole('button', { name: m.guestbook_message_submit() }))
    expect(await screen.findByRole('alert')).toHaveTextContent(m.error_create_message_failed())
    expect(screen.getByRole('textbox')).toHaveValue('Keep this draft')
  })
  test('locks the composer while signing out', () => {
    setup(true)
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('button', { name: m.guestbook_message_submit() })).toBeDisabled()
    expect(fixture.create).not.toHaveBeenCalled()
  })
})
