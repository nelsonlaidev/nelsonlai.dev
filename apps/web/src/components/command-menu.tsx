'use client'

import { useRouter } from '@repo/i18n/routing'
import { Button } from '@repo/ui/components/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@repo/ui/components/command'
import { CodeIcon, CommandIcon, LinkIcon, LogInIcon, LogOutIcon, UserCircleIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Fragment, useCallback, useEffect, useState } from 'react'

import { SOCIAL_LINKS } from '@/config/links'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useSignOut } from '@/hooks/use-sign-out'
import { useSession } from '@/lib/auth-client'
import { useDialogsStore } from '@/stores/dialogs.store'

type CommandAction = {
  title: string
  icon: React.ReactNode
  onSelect: () => void | Promise<void>
}

type CommandGroup = {
  name: string
  actions: CommandAction[]
}

const CommandMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [copy] = useCopyToClipboard()
  const { data: session } = useSession()
  const t = useTranslations()
  const setIsSignInOpen = useDialogsStore((state) => state.setIsSignInOpen)
  const router = useRouter()
  const signOut = useSignOut({ redirectTo: '/' })

  const closeMenu = () => {
    setIsOpen(false)
  }

  const openMenu = () => {
    setIsOpen(true)
  }

  const toggleMenu = () => {
    setIsOpen((value) => !value)
  }

  const openExternalLink = (url: string) => {
    closeMenu()
    window.open(url, '_blank', 'noopener')
  }

  const copyCurrentUrl = async () => {
    closeMenu()
    await copy({ text: globalThis.location.href })
  }

  const handleAccountNavigate = () => {
    closeMenu()
    router.push('/account')
  }

  const handleSignIn = () => {
    closeMenu()
    setIsSignInOpen(true)
  }

  const handleSignOut = async () => {
    closeMenu()

    await signOut()
  }

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      toggleMenu()
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const accountActions: CommandAction[] = session
    ? [
        {
          title: t('common.labels.account'),
          icon: <UserCircleIcon />,
          onSelect: handleAccountNavigate
        },
        {
          title: t('common.sign-out'),
          icon: <LogOutIcon />,
          onSelect: handleSignOut
        }
      ]
    : [
        {
          title: t('common.sign-in'),
          icon: <LogInIcon />,
          onSelect: handleSignIn
        }
      ]

  const generalActions: CommandAction[] = [
    {
      title: t('command-menu.actions.copy-link'),
      icon: <LinkIcon />,
      onSelect: copyCurrentUrl
    },
    {
      title: t('command-menu.actions.source-code'),
      icon: <CodeIcon />,
      onSelect: () => {
        openExternalLink('https://github.com/nelsonlaidev/nelsonlai.dev')
      }
    }
  ]

  const socialActions: CommandAction[] = SOCIAL_LINKS.map((link) => ({
    title: link.title,
    icon: link.icon,
    onSelect: () => {
      openExternalLink(link.href)
    }
  }))

  const groups: CommandGroup[] = [
    { name: t('common.labels.account'), actions: accountActions },
    { name: t('common.labels.general'), actions: generalActions },
    { name: t('command-menu.groups.social'), actions: socialActions }
  ]

  return (
    <>
      <Button
        variant='ghost'
        className='size-9 p-0'
        onClick={openMenu}
        aria-label={t('command-menu.open-menu')}
        data-testid='command-menu-button'
      >
        <CommandIcon />
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder={t('command-menu.placeholder')} />
        <CommandList>
          <CommandEmpty>{t('command-menu.no-results')}</CommandEmpty>
          {groups.map((group, index) => (
            <Fragment key={group.name}>
              <CommandGroup heading={group.name}>
                {group.actions.map((action) => (
                  <CommandItem key={action.title} onSelect={action.onSelect}>
                    {action.icon}
                    {action.title}
                  </CommandItem>
                ))}
              </CommandGroup>
              {index === groups.length - 1 ? null : <CommandSeparator />}
            </Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default CommandMenu
