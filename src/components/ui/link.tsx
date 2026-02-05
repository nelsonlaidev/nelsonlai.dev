import { Link as LocalizedLink } from '@/i18n/routing'

type LinkProps = React.ComponentProps<'a'>

function Link(props: LinkProps) {
  const { href, children, ...rest } = props

  if (!href) {
    throw new Error('Link must have an href')
  }

  if (href.startsWith('/')) {
    return (
      <LocalizedLink href={href} {...rest}>
        {children}
      </LocalizedLink>
    )
  }

  if (href.startsWith('#')) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <a target='_blank' rel='noopener noreferrer' href={href} {...rest}>
      {children}
    </a>
  )
}

export { Link }
