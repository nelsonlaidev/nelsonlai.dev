'use client'

import { MenuIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Link } from '@/components/ui/link'
import { HEADER_LINKS } from '@/constants/navigation'

export function MobileNav() {
  const t = useTranslations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant='ghost' size='icon' aria-label={t('layout.toggle-menu')} className='md:hidden'>
            <MenuIcon />
          </Button>
        }
      />
      <DropdownMenuContent align='end'>
        {HEADER_LINKS.map((link) => (
          <DropdownMenuItem
            key={link.href}
            render={
              <Link href={link.href}>
                {link.icon}
                {t(link.labelKey)}
              </Link>
            }
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
