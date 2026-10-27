import type { Theme } from '@/components/theme-provider'

import { Button } from '@repo/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { flushSync } from 'react-dom'

import { useTheme } from '@/components/theme-provider'
import { m } from '@/paraglide/messages'

const THEMES = [
  { label: m.theme_switcher_light, value: 'light', icon: <SunIcon /> },
  { label: m.theme_switcher_dark, value: 'dark', icon: <MoonIcon /> },
  { label: m.theme_switcher_system, value: 'system', icon: <MonitorIcon /> },
] as const

export function ThemeSwitcher() {
  const { setTheme } = useTheme()

  function handleThemeChange(theme: Theme) {
    if (!('startViewTransition' in document) || globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(theme)
      return
    }

    document.startViewTransition(() => {
      // Flush the theme effect before the browser captures the new snapshot.
      // oxlint-disable-next-line @eslint-react/dom-no-flush-sync
      flushSync(() => {
        setTheme(theme)
      })
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant='ghost' size='icon' aria-label={m.theme_switcher_label()} data-testid='theme-toggle' />}
      >
        <SunIcon className='dark:hidden' />
        <MoonIcon className='hidden dark:block' />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-36'>
        {THEMES.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => {
              handleThemeChange(theme.value)
            }}
            data-testid={`theme-option-${theme.value}`}
          >
            {theme.icon}
            {theme.label()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
