'use client'

import type { ReactNode } from 'react'

import { SiFacebook, SiGithub, SiInstagram, SiX, SiYoutube } from '@icons-pack/react-simple-icons'
import { useTranslations } from '@repo/i18n/client'
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
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { signOut, useSession } from '@/lib/auth-client'
import { SITE_FACEBOOK_URL, SITE_GITHUB_URL, SITE_INSTAGRAM_URL, SITE_X_URL, SITE_YOUTUBE_URL } from '@/lib/constants'
import { useDialogsStore } from '@/stores/dialogs.store'

type CommandAction = {
  title: string
  icon: ReactNode
  onSelect: () => void | Promise<void>
}

type CommandGroup = {
  name: string
  actions: CommandAction[]
}

const SOCIAL_LINKS: Array<{ title: string; icon: ReactNode; url: string }> = [
  { title: 'GitHub', icon: <SiGithub />, url: SITE_GITHUB_URL },
  { title: 'Facebook', icon: <SiFacebook />, url: SITE_FACEBOOK_URL },
  { title: 'Instagram', icon: <SiInstagram />, url: SITE_INSTAGRAM_URL },
  { title: 'X', icon: <SiX />, url: SITE_X_URL },
  { title: 'YouTube', icon: <SiYoutube />, url: SITE_YOUTUBE_URL }
]

const CommandMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [copy] = useCopyToClipboard()
  const { data: session } = useSession()
  const t = useTranslations()
  const setIsSignInOpen = useDialogsStore((state) => state.setIsSignInOpen)
  const router = useRouter()

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  const openMenu = useCallback(() => {
    setIsOpen(true)
  }, [])

  const toggleMenu = useCallback(() => {
    setIsOpen((value) => !value)
  }, [])

  const openExternalLink = useCallback(
    (url: string) => {
      closeMenu()
      window.open(url, '_blank', 'noopener')
    },
    [closeMenu]
  )

  const copyCurrentUrl = useCallback(async () => {
    closeMenu()
    await copy({ text: globalThis.location.href })
  }, [closeMenu, copy])

  const handleAccountNavigate = useCallback(() => {
    closeMenu()
    router.push('/account')
  }, [closeMenu, router])

  const handleSignIn = useCallback(() => {
    closeMenu()
    setIsSignInOpen(true)
  }, [closeMenu, setIsSignInOpen])

  const handleSignOut = useCallback(async () => {
    closeMenu()
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh()
        }
      }
    })
  }, [closeMenu, router])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleMenu()
      }
    },
    [toggleMenu]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const accountActions = useMemo<CommandAction[]>(() => {
    if (session) {
      return [
        {
          title: t('account.title'),
          icon: <UserCircleIcon />,
          onSelect: handleAccountNavigate
        },
        {
          title: t('common.sign-out'),
          icon: <LogOutIcon />,
          onSelect: handleSignOut
        }
      ]
    }

    return [
      {
        title: t('common.sign-in'),
        icon: <LogInIcon />,
        onSelect: handleSignIn
      }
    ]
  }, [handleAccountNavigate, handleSignIn, handleSignOut, session, t])

  const generalActions = useMemo<CommandAction[]>(
    () => [
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
    ],
    [copyCurrentUrl, openExternalLink, t]
  )

  const socialActions = useMemo<CommandAction[]>(
    () =>
      SOCIAL_LINKS.map((link) => ({
        title: link.title,
        icon: link.icon,
        onSelect: () => {
          openExternalLink(link.url)
        }
      })),
    [openExternalLink]
  )

  const groups = useMemo<CommandGroup[]>(
    () => [
      { name: t('command-menu.groups.account'), actions: accountActions },
      { name: t('command-menu.groups.general'), actions: generalActions },
      { name: t('command-menu.groups.social'), actions: socialActions }
    ],
    [accountActions, generalActions, socialActions, t]
  )

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
