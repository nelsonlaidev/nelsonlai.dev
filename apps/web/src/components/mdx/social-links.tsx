import { ExternalLink } from '@repo/ui/components/external-link'

import { SOCIAL_LINKS } from '@/lib/social-links'

export function SocialLinks() {
  return (
    <ul>
      {SOCIAL_LINKS.map(({ href, title }) => (
        <li key={href}>
          <ExternalLink href={href}>{title}</ExternalLink>
        </li>
      ))}
    </ul>
  )
}
