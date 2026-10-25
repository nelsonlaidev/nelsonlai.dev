import { ExternalLink } from '@repo/ui/components/external-link'
import { Link } from '@tanstack/react-router'

export function MdxLink(props: React.ComponentProps<'a'>) {
  const { children, href, ...rest } = props

  if (href && (/^https?:\/\//i.test(href) || href.startsWith('//'))) {
    return (
      <ExternalLink href={href} {...rest}>
        {children}
      </ExternalLink>
    )
  }

  if (href?.startsWith('/')) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}
