'use client'

import { useTranslations } from 'next-intl'

import { Link } from '@/components/ui/link'
import { HEADER_LINKS } from '@/config/links'
import { usePathname } from '@/i18n/routing'

function Navbar() {
  const pathname = usePathname()
  const t = useTranslations()

  return (
    <nav className='hidden md:block'>
      <ul className='flex gap-2'>
        {HEADER_LINKS.map((link) => (
          <li key={link.key} className='relative flex items-center justify-center'>
            <Link
              className='rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-active:text-foreground'
              data-active={link.href === pathname}
              href={link.href}
            >
              {t(link.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
