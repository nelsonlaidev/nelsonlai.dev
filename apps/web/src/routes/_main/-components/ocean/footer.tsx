import { ExternalLink } from '@repo/ui/components/external-link'
import { Link } from '@tanstack/react-router'
import { ArrowUpRightIcon } from 'lucide-react'
import { useState } from 'react'

import { FOOTER_GROUPS } from '@/lib/navigation'
import { SITE } from '@/lib/site'
import { m } from '@/paraglide/messages'

import { LocaleSwitcher } from '../locale-switcher'
import { OceanBrand } from './brand'

export function OceanFooter() {
  const [year] = useState(() => new Date().getUTCFullYear())
  const groups = [
    {
      title: m.ocean_explore(),
      links: [
        { to: '/', label: m.nav_home },
        { to: '/projects', label: m.nav_projects },
        { to: '/blog', label: m.nav_blog },
        { to: '/about', label: m.nav_about },
      ],
    },
    {
      title: m.ocean_around(),
      links: FOOTER_GROUPS.filter((group) => group.id === 'site')
        .flatMap((group) => group.links)
        .filter((link) => !('to' in link) || link.to !== '/projects')
        .toSpliced(0, 0, { to: '/dashboard', label: m.nav_dashboard }),
    },
    {
      title: m.ocean_elsewhere(),
      links: [
        { href: SITE.socials.github, label: 'GitHub' },
        { href: SITE.socials.youtube, label: 'YouTube' },
        { href: SITE.socials.instagram, label: 'Instagram' },
        { href: SITE.socials.facebook, label: 'Facebook' },
      ],
    },
  ]

  return (
    <footer className='mt-14 bg-linear-to-b from-transparent to-[#031d2bb3] pr-[max(16px,env(safe-area-inset-right))] pb-8 pl-[max(16px,env(safe-area-inset-left))] text-[#bfd5cc] min-[541px]:px-[8%] min-[1101px]:px-[10%]'>
      <div className='mx-auto max-w-7xl border-t border-[#a6c9bc50]'>
        <div className='grid gap-8 pt-10 pb-11.5 min-[801px]:grid-cols-[minmax(200px,.85fr)_minmax(0,2fr)] min-[801px]:gap-10 min-[1101px]:grid-cols-[minmax(220px,1fr)_minmax(0,2fr)] min-[1101px]:gap-20 min-[1101px]:pt-13'>
          <div>
            <Link
              to='/'
              aria-label={`Seafold ${m.nav_home()}`}
              className='inline-flex min-h-11 items-center text-foreground'
            >
              <OceanBrand large />
            </Link>
            <p className='mt-6 text-base/relaxed'>Nelson Lai</p>
            <a
              href={`mailto:${SITE.email}`}
              className='inline-flex min-h-11 items-center gap-3 text-base hover:underline'
            >
              {SITE.email}
              <ArrowUpRightIcon className='size-4.5' aria-hidden='true' />
            </a>
          </div>
          <nav
            aria-label={m.nav_footer()}
            className='grid grid-cols-2 gap-x-5 gap-y-7 min-[541px]:grid-cols-3 min-[1101px]:gap-8.75'
          >
            {groups.map((group) => (
              <div key={group.title} className='min-w-0 max-[540px]:last:col-span-full'>
                <h2 className='mb-4 text-base/normal font-medium text-foreground min-[541px]:mt-2'>{group.title}</h2>
                <ul
                  className={
                    group.title === m.ocean_elsewhere() ? 'grid grid-cols-2 min-[541px]:grid-cols-1' : undefined
                  }
                >
                  {group.links.map((link) => (
                    <li key={'to' in link ? link.to : link.href}>
                      {'to' in link ? (
                        <Link
                          to={link.to}
                          className='inline-flex min-h-11 items-center text-base hover:text-foreground hover:underline'
                        >
                          {typeof link.label === 'string' ? link.label : link.label()}
                        </Link>
                      ) : (
                        <ExternalLink
                          href={link.href}
                          className='inline-flex min-h-11 items-center gap-2 text-base hover:text-foreground hover:underline'
                        >
                          {typeof link.label === 'string' ? link.label : link.label()}
                          <ArrowUpRightIcon className='size-3.5 opacity-80' aria-hidden='true' />
                        </ExternalLink>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className='flex flex-wrap items-center gap-x-8.75 gap-y-2 border-t border-[#a6c9bc30] pt-5 text-sm/relaxed'>
          <p className='max-[540px]:w-full'>&copy; {year} Nelson Lai</p>
          <nav aria-label={m.ocean_legal()} className='flex flex-wrap gap-x-6 text-base'>
            <Link to='/terms' className='inline-flex min-h-11 items-center hover:underline'>
              {m.common_labels_terms()}
            </Link>
            <Link to='/privacy' className='inline-flex min-h-11 items-center hover:underline'>
              {m.common_labels_privacy()}
            </Link>
          </nav>
          <div className='min-[541px]:ml-auto'>
            <LocaleSwitcher compact />
          </div>
          <span className='font-mono text-sm text-muted-foreground'>{m.ocean_revision_unavailable()}</span>
        </div>
      </div>
    </footer>
  )
}
