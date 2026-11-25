import { ExternalLink } from '@repo/ui/components/external-link'
import { Link } from '@tanstack/react-router'
import { ArrowUpRightIcon } from 'lucide-react'
import { useState } from 'react'

import { ENV } from '@/env'
import { SITE } from '@/lib/site'
import { SOCIAL_LINKS } from '@/lib/social-links'
import { m } from '@/paraglide/messages'
import { LocaleSwitcher } from '@/routes/_main/-components/locale-switcher'

import { NowPlaying } from './now-playing'
import { SiteLogo } from './site-logo'

const commitSha = ENV.VITE_COMMIT_SHA

export function Footer() {
  const [year] = useState(() => new Date().getUTCFullYear())
  const groups = [
    {
      id: 'explore',
      title: m.nav_explore(),
      links: [
        { to: '/', label: m.nav_home },
        { to: '/projects', label: m.nav_projects },
        { to: '/blog', label: m.nav_blog },
        { to: '/about', label: m.nav_about },
      ],
    },
    {
      id: 'around',
      title: m.nav_footer_around(),
      links: [
        { to: '/dashboard', label: m.nav_dashboard },
        { to: '/guestbook', label: m.nav_guestbook },
        { to: '/uses', label: m.nav_uses },
        { href: SITE.links, label: m.common_labels_links },
      ],
    },
    {
      id: 'elsewhere',
      title: m.nav_footer_elsewhere(),
      links: SOCIAL_LINKS.filter(({ href }) => href !== SITE.socials.youtube).map(({ href, title }) => ({
        href,
        label: title,
      })),
    },
    {
      id: 'legal',
      title: m.nav_legal(),
      links: [
        { to: '/terms', label: m.common_labels_terms },
        { to: '/privacy', label: m.common_labels_privacy },
      ],
    },
  ]

  return (
    <footer className='bg-linear-to-b from-transparent to-backdrop/70 pt-20 pr-[max(16px,env(safe-area-inset-right))] pb-8 pl-[max(16px,env(safe-area-inset-left))] text-muted-foreground sm:px-[8%] xl:px-[10%]'>
      <div className='mx-auto max-w-7xl space-y-16'>
        <div className='grid gap-8 lg:grid-cols-[minmax(--spacing(48),.85fr)_minmax(0,2fr)] lg:gap-10 xl:grid-cols-[minmax(--spacing(56),1fr)_minmax(0,2fr)] xl:gap-20'>
          <div className='flex min-w-0 flex-col items-start gap-6'>
            <Link to='/' aria-label={`Seafold ${m.nav_home()}`} className='inline-flex items-center text-foreground'>
              <SiteLogo large />
            </Link>
            <a href={`mailto:${SITE.email}`} className='hover:text-foreground'>
              {SITE.email}
            </a>
            <LocaleSwitcher />
          </div>
          <nav aria-label={m.nav_footer()} className='grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-4 xl:gap-9'>
            {groups.map((group) => (
              <div key={group.id} className='min-w-0'>
                <h2 className='mb-4 font-medium text-foreground sm:mt-2'>{group.title}</h2>
                <ul className='grid gap-y-2'>
                  {group.links.map((link) => (
                    <li key={'to' in link ? link.to : link.href}>
                      {'to' in link ? (
                        <Link to={link.to} className='inline-flex items-center hover:text-foreground'>
                          {typeof link.label === 'string' ? link.label : link.label()}
                        </Link>
                      ) : (
                        <ExternalLink href={link.href} className='inline-flex items-center gap-2 hover:text-foreground'>
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
        <NowPlaying className='min-w-0' />
        <div className='flex items-center justify-between gap-4 text-sm'>
          <p>&copy; {year} Nelson Lai</p>
          {commitSha && (
            <ExternalLink href={`${SITE.repository}/commit/${commitSha}`} className='font-mono hover:text-foreground'>
              {commitSha.slice(0, 7)}
            </ExternalLink>
          )}
        </div>
      </div>
    </footer>
  )
}
