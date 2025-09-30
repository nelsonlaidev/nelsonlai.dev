import { type Locale, useTranslations } from '@repo/i18n/client'
import { localeLabels, routing, usePathname, useRouter } from '@repo/i18n/routing'
import { Button } from '@repo/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@repo/ui/components/dropdown-menu'
import { LanguagesIcon } from 'lucide-react'
import { useTransition } from 'react'

const LocaleSwitcher = () => {
  const t = useTranslations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='size-9 p-0' aria-label={t('layout.change-language')}>
          <LanguagesIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {routing.locales.map((locale) => (
          <Item key={locale} locale={locale} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type ItemProps = {
  locale: Locale
}

const Item = (props: ItemProps) => {
  const { locale } = props
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = () => {
    startTransition(() => {
      router.replace(pathname, { locale })
    })
  }

  return (
    <DropdownMenuItem key={locale} disabled={isPending} onClick={switchLanguage}>
      {localeLabels[locale]}
    </DropdownMenuItem>
  )
}

export default LocaleSwitcher
