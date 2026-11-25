import { DialogTrigger } from '@repo/ui/components/dialog'
import { UIProvider } from '@repo/ui/components/ui-provider'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { SignInDialog, signInDialogHandle } from '@/features/auth/sign-in-dialog'
import { m } from '@/paraglide/messages'

type ToastOptions = {
  type: string
  title: string
}

type MockLinkProps = {
  children: React.ReactNode
  to: string
}

const fixture = vi.hoisted(() => ({
  signIn: vi.fn<
    () => Promise<{
      error: {
        message: string
      } | null
    }>
  >(),
  toast: vi.fn<(message: ToastOptions) => void>(),
}))

vi.mock('@repo/auth/client', () => ({
  authClient: { getLastUsedLoginMethod: () => 'github', signIn: { social: fixture.signIn } },
}))

vi.mock('@repo/ui/components/toast', () => ({ toast: { add: fixture.toast } }))

vi.mock('@tanstack/react-router', () => ({
  Link: (props: MockLinkProps) => <a href={props.to}>{props.children}</a>,
}))

function setup() {
  render(
    <UIProvider
      translations={{
        close: 'Close',
        loading: 'Loading',
        treeView: 'Tree',
        sidebarTitle: 'Sidebar',
        sidebarDescription: 'Navigation',
        toggleSidebar: 'Toggle sidebar',
      }}
    >
      <DialogTrigger handle={signInDialogHandle}>Open fixture sign in</DialogTrigger>
      <SignInDialog />
    </UIProvider>,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Open fixture sign in' }))
}

beforeEach(() => {
  fixture.signIn.mockReset().mockResolvedValue({ error: null })
  fixture.toast.mockReset()
})

describe('Sign-in dialog with mocked providers only', () => {
  test('preserves providers, last-used badge and policy links', async () => {
    setup()

    expect(await screen.findByRole('dialog')).toHaveAttribute('data-slot', 'dialog-content')
    expect(screen.getByRole('button', { name: /GitHub/ })).toHaveTextContent(m.auth_sign_in_last_used())
    expect(screen.getByRole('button', { name: /Google/ })).toBeEnabled()
    expect(screen.getByRole('link', { name: m.common_labels_terms() })).toHaveAttribute('href', '/terms')
    expect(screen.getByRole('link', { name: m.common_labels_privacy() })).toHaveAttribute('href', '/privacy')
    expect(fixture.signIn).not.toHaveBeenCalled()
  })

  test('disables both providers during a pending mock sign-in', async () => {
    fixture.signIn.mockReturnValue(new Promise(() => {}))
    setup()
    const github = await screen.findByRole('button', { name: /GitHub/ })

    fireEvent.click(github)
    fireEvent.click(github)

    expect(github).toBeDisabled()
    expect(screen.getByRole('button', { name: /Google/ })).toBeDisabled()
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-busy', 'true')
    expect(fixture.signIn).toHaveBeenCalledOnce()
  })

  test('reports provider failure and allows a retry', async () => {
    fixture.signIn.mockRejectedValue(new Error('Mock provider unavailable'))
    setup()
    const google = await screen.findByRole('button', { name: /Google/ })

    fireEvent.click(google)

    await waitFor(() => {
      expect(fixture.toast).toHaveBeenCalledWith({ type: 'error', title: m.error_sign_in_error() })
    })
    expect(google).toBeEnabled()
  })

  test('can close and reopen without initiating authentication', async () => {
    setup()

    fireEvent.click(await screen.findByRole('button', { name: 'Close' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Open fixture sign in' }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(fixture.signIn).not.toHaveBeenCalled()
  })
})
