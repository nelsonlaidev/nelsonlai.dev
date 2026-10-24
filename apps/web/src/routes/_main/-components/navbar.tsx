import { Link } from '@tanstack/react-router'

import { HEADER_LINKS } from '@/lib/navigation'

export function Navbar() {
  return (
    <nav className='hidden md:block'>
      <ul className='flex items-center gap-2'>
        {HEADER_LINKS.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              activeProps={{ 'data-active': 'true' }}
              className='px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-active:text-foreground'
            >
              {link.label()}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
