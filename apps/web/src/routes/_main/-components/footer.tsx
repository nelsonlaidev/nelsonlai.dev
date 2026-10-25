import { ExternalLink } from '@repo/ui/components/external-link'
import { Link } from '@tanstack/react-router'

import { FOOTER_GROUPS } from '@/lib/navigation'
import { m } from '@/paraglide/messages'

import { GitHubStarButton } from './github-star-button'
import { LocaleSwitcher } from './locale-switcher'
import { NowPlaying } from './now-playing'

type FooterProps = {
  copyrightYear: number
}

export function Footer(props: FooterProps) {
  const { copyrightYear } = props

  return (
    <footer className='mx-auto mb-12 w-full max-w-5xl rounded-2xl bg-background/30 p-8 backdrop-blur-md'>
      <NowPlaying className='mb-12' />
      <nav aria-label={m.nav_footer()} className='mb-30 grid grid-cols-2 gap-10 sm:grid-cols-3'>
        {FOOTER_GROUPS.map((group) => (
          <ul key={group.id} className='flex flex-col items-start gap-4'>
            {group.links.map((link) => (
              <li key={'to' in link ? link.to : link.href}>
                {'to' in link ? (
                  <Link to={link.to} className='text-muted-foreground transition-colors hover:text-foreground'>
                    {typeof link.label === 'string' ? link.label : link.label()}
                  </Link>
                ) : (
                  <ExternalLink
                    href={link.href}
                    className='text-muted-foreground transition-colors hover:text-foreground'
                  >
                    {typeof link.label === 'string' ? link.label : link.label()}
                  </ExternalLink>
                )}
              </li>
            ))}
          </ul>
        ))}
      </nav>
      <div className='mt-20 space-y-4'>
        <LocaleSwitcher />
        <div className='flex flex-wrap items-center justify-between gap-4 text-sm'>
          <p className='text-muted-foreground'>&copy; {copyrightYear} Nelson Lai</p>
          <GitHubStarButton />
        </div>
      </div>
    </footer>
  )
}
