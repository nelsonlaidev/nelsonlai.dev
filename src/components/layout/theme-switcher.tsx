import { MoonIcon, SunIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { THEMES } from '@/constants/themes'

export function ThemeSwitcher() {
  const { setTheme } = useTheme()
  const t = useTranslations()

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
              setTheme(theme.value)
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
