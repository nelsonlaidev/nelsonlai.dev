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
        {HEADER_LINKS.map((link) => {
          const isActive = link.href === pathname

          return (
            <li key={link.key} className='relative flex items-center justify-center'>
              <Link
                className='rounded-sm px-3 py-2 text-sm font-medium transition-colors'
                href={link.href}
                variant={isActive ? undefined : 'muted'}
              >
                {t(link.labelKey)}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Navbar
