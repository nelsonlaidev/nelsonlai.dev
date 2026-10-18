import { MoonIcon, SunIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { flushSync } from 'react-dom'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { THEMES } from '@/constants/themes'

export function ThemeSwitcher() {
  const { setTheme } = useTheme()
  const t = useTranslations()

  function handleThemeChange(theme: (typeof THEMES)[number]['value']) {
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
        render={
          <Button variant='ghost' size='icon' aria-label={t('theme-toggle.toggle-theme')} data-testid='theme-toggle'>
            <SunIcon className='dark:hidden' />
            <MoonIcon className='hidden dark:block' />
          </Button>
        }
      />
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
            {t(theme.labelKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
