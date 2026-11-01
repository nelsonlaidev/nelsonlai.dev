import { Button } from '@repo/ui/components/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@repo/ui/components/command'
import { DialogTrigger } from '@repo/ui/components/dialog'
import { toast } from '@repo/ui/components/toast'
import { useNavigate } from '@tanstack/react-router'
import { CodeIcon, CommandIcon, LinkIcon, LogInIcon, LogOutIcon, ShieldIcon, UserCircleIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { signInDialogHandle } from '@/features/auth/sign-in-dialog'
import { useSignOut } from '@/features/auth/use-sign-out'
import { authClient } from '@/lib/auth-client'
import { SITE } from '@/lib/site'
import { SOCIAL_LINKS } from '@/lib/social-links'
import { m } from '@/paraglide/messages'

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { data: session, isPending } = authClient.useSession()
  const { isSigningOut, signOut } = useSignOut()
  const navigate = useNavigate()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== 'k' || (!event.metaKey && !event.ctrlKey) || event.isComposing) return
      event.preventDefault()
      if (!event.repeat) setOpen((value) => !value)
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  async function copyCurrentUrl() {
    setOpen(false)

    try {
      await navigator.clipboard.writeText(globalThis.location.href)
      toast.add({ type: 'success', title: m.success_copied_to_clipboard() })
    } catch {
      toast.add({ type: 'error', title: m.error_copy_to_clipboard_error() })
    }
  }

  async function handleSignOut() {
    setOpen(false)

    await signOut()
  }

  const contentProps = {
    initialFocus: inputRef,
    finalFocus: () => (signInDialogHandle.isOpen ? false : triggerRef.current),
  }

  return (
    <CommandDialog
      className='max-h-[calc(100dvh-32px)] max-w-[min(480px,calc(100vw-32px))] overflow-y-auto border shadow-md ring-0 **:data-[slot=input-group]:min-h-11 sm:max-w-[min(480px,calc(100vw-32px))]'
      open={open}
      onOpenChange={setOpen}
      trigger={
        <DialogTrigger
          render={<Button ref={triggerRef} variant='ghost' size='icon' className='size-11' />}
          aria-label={m.command_menu_open_menu()}
          aria-keyshortcuts='Meta+K Control+K'
        >
          <CommandIcon aria-hidden='true' />
        </DialogTrigger>
      }
      contentProps={contentProps}
    >
      <Command loop label={m.command_menu_title()}>
        <CommandInput ref={inputRef} placeholder={m.command_menu_placeholder()} />
        <CommandList label={m.command_menu_title()}>
          <CommandEmpty>{m.command_menu_no_results()}</CommandEmpty>
          <CommandGroup heading={m.common_labels_account()}>
            {session ? (
              <>
                <CommandItem
                  className='min-h-11'
                  onSelect={() => {
                    setOpen(false)
                    void navigate({ to: '/account' })
                  }}
                >
                  <UserCircleIcon aria-hidden='true' />
                  {m.common_labels_account()}
                </CommandItem>
                {session.user.role === 'admin' && (
                  <CommandItem
                    className='min-h-11'
                    onSelect={() => {
                      setOpen(false)
                      void navigate({ to: '/admin' })
                    }}
                  >
                    <ShieldIcon aria-hidden='true' />
                    {m.common_labels_admin()}
                  </CommandItem>
                )}
                <CommandItem className='min-h-11' disabled={isSigningOut} onSelect={handleSignOut}>
                  <LogOutIcon aria-hidden='true' />
                  {m.common_sign_out()}
                </CommandItem>
              </>
            ) : (
              <CommandItem
                className='min-h-11'
                disabled={isPending}
                onSelect={() => {
                  setOpen(false)
                  signInDialogHandle.open(null)
                }}
              >
                <LogInIcon aria-hidden='true' />
                {m.common_sign_in()}
              </CommandItem>
            )}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={m.common_labels_general()}>
            <CommandItem className='min-h-11' onSelect={copyCurrentUrl}>
              <LinkIcon aria-hidden='true' />
              {m.command_menu_actions_copy_link()}
            </CommandItem>
            <CommandItem
              className='min-h-11'
              onSelect={() => {
                setOpen(false)
                window.open(SITE.repository, '_blank', 'noopener,noreferrer')
              }}
            >
              <CodeIcon aria-hidden='true' />
              {m.command_menu_actions_source_code()}
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={m.command_menu_groups_social()}>
            {SOCIAL_LINKS.map((link) => (
              <CommandItem
                className='min-h-11'
                key={link.href}
                value={link.title}
                onSelect={() => {
                  setOpen(false)
                  window.open(link.href, '_blank', 'noopener,noreferrer')
                }}
              >
                <link.icon aria-hidden='true' />
                {link.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
