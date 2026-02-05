'use client'

import { MenuIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Link } from '@/components/ui/link'
import { HEADER_LINKS } from '@/config/links'

function MobileNav() {
  const t = useTranslations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className='flex size-9 items-center justify-center p-0 md:hidden'
            aria-label={t('layout.toggle-menu')}
            variant='ghost'
          >
            <MenuIcon />
          </Button>
        }
      />
      <DropdownMenuContent align='end' sideOffset={20} className='min-w-40'>
        {HEADER_LINKS.map((link) => (
          <DropdownMenuItem
            key={link.key}
            render={
              <Link href={link.href} className='flex items-center gap-4'>
                {link.icon}
                <div>{t(link.labelKey)}</div>
              </Link>
            }
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MobileNav
