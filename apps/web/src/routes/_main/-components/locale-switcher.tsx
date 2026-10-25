import type { Locale } from '@/paraglide/runtime'

import { Button } from '@repo/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { ChevronDownIcon, LanguagesIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'
import { getLocale, isLocale, locales, setLocale } from '@/paraglide/runtime'

// cspell:language en-US,es,pt-br
const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  'zh-TW': '繁體中文',
  'zh-CN': '简体中文',
  ja: '日本語',
  es: 'Español',
  'pt-BR': 'Português (Brasil)',
}

export function LocaleSwitcher() {
  const locale = getLocale()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant='outline' aria-label={m.layout_change_language()}>
            <LanguagesIcon aria-hidden='true' />
            {LOCALE_LABELS[locale]}
            <ChevronDownIcon aria-hidden='true' />
          </Button>
        }
      />
      <DropdownMenuContent align='start' side='top'>
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => {
            if (isLocale(value) && value !== locale) void setLocale(value)
          }}
        >
          {locales.map((value) => (
            <DropdownMenuRadioItem key={value} value={value} closeOnClick lang={value}>
              {LOCALE_LABELS[value]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
