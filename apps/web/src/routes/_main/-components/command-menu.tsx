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
import { CodeIcon, CommandIcon, LinkIcon, LogInIcon, LogOutIcon } from 'lucide-react'
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
    if (await signOut()) await navigate({ to: '/' })
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <DialogTrigger
          render={<Button ref={triggerRef} variant='ghost' size='icon' />}
          aria-label={m.command_menu_open_menu()}
          aria-keyshortcuts='Meta+K Control+K'
          data-testid='command-menu-button'
        >
          <CommandIcon aria-hidden='true' />
        </DialogTrigger>
      }
      contentProps={{
        initialFocus: inputRef,
        finalFocus: () => (signInDialogHandle.isOpen ? false : triggerRef.current),
      }}
    >
      <Command loop label={m.command_menu_title()}>
        <CommandInput ref={inputRef} placeholder={m.command_menu_placeholder()} />
        <CommandList label={m.command_menu_title()}>
          <CommandEmpty>{m.command_menu_no_results()}</CommandEmpty>
          <CommandGroup heading={m.common_labels_account()}>
            {session ? (
              <CommandItem disabled={isSigningOut} onSelect={handleSignOut}>
                <LogOutIcon aria-hidden='true' />
                {m.common_sign_out()}
              </CommandItem>
            ) : (
              <CommandItem
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
            <CommandItem onSelect={copyCurrentUrl}>
              <LinkIcon aria-hidden='true' />
              {m.command_menu_actions_copy_link()}
            </CommandItem>
            <CommandItem
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
