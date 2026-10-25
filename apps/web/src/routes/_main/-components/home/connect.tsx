import { ExternalLink } from '@repo/ui/components/external-link'
import { LinkIcon } from 'lucide-react'

import { SOCIAL_LINKS } from '@/lib/social-links'
import { m } from '@/paraglide/messages'

export function Connect() {
  return (
    <div className='flex flex-col gap-6 rounded-2xl p-4 shadow-feature-card lg:p-6'>
      <div className='flex items-center gap-2'>
        <LinkIcon className='size-4.5' />
        <h2 className='text-sm'>{m.homepage_about_me_connect()}</h2>
      </div>
      <div className='flex flex-col gap-4 px-2'>
        {SOCIAL_LINKS.map((link) => (
          <ExternalLink
            key={link.href}
            href={link.href}
            className='flex w-fit items-center gap-3 text-muted-foreground transition-colors hover:text-foreground [&>svg]:size-4.5'
          >
            <link.icon />
            <h3>{link.title}</h3>
          </ExternalLink>
        ))}
      </div>
    </div>
  )
}
