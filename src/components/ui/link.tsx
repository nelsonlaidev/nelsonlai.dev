// eslint-disable-next-line no-restricted-imports
import { Link as LocalizedLink } from '@/i18n/routing'

type InternalLink = '/' | `/${string}`
type ExternalLink = `http://${string}` | `https://${string}` | `mailto:${string}` | `tel:${string}`
type ValidLink = InternalLink | ExternalLink

type LinkProps<Href> = Href extends ExternalLink
  ? React.ComponentProps<'a'> & { href: Href }
  : React.ComponentProps<typeof LocalizedLink>

export function Link<Href extends ValidLink>(props: LinkProps<Href>) {
  if (isExternalLink(props)) {
    const { href, ...rest } = props

    return (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a href={href} {...(href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })} {...rest} />
    )
  }

  if (isInternalLink(props)) {
    const { href, ...rest } = props

    return <LocalizedLink href={href} {...rest} />
  }

  throw new Error(`Invalid link: ${JSON.stringify(props)}`)
}

function isInternalLink(props: LinkProps<ValidLink>): props is LinkProps<InternalLink> {
  const { href } = props
  if (!href) return false
  return typeof href === 'object' || (typeof href === 'string' && href.startsWith('/'))
}

function isExternalLink(props: LinkProps<ValidLink>): props is LinkProps<ExternalLink> {
  const { href } = props
  if (!href || typeof href !== 'string') return false
  return href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
}
