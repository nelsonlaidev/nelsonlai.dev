import { Link as LocalizedLink } from '@repo/i18n/routing'
import { cva, type VariantProps } from 'cva'

import { cn } from '../utils/cn'

const linkVariants = cva({
  variants: {
    variant: {
      muted: 'text-muted-foreground transition-colors hover:text-foreground'
    }
  }
})

type LinkProps = React.ComponentProps<'a'> & VariantProps<typeof linkVariants>

const Link = (props: LinkProps) => {
  const { className, variant, href, children, ...rest } = props

  if (!href) {
    throw new Error('Link must have an href')
  }

  if (href.startsWith('/')) {
    return (
      <LocalizedLink className={cn(linkVariants({ variant, className }))} href={href} {...rest}>
        {children}
      </LocalizedLink>
    )
  }

  if (href.startsWith('#')) {
    return (
      <a className={cn(linkVariants({ variant, className }))} href={href} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <a
      className={cn(linkVariants({ variant, className }))}
      target='_blank'
      rel='noopener noreferrer'
      href={href}
      {...rest}
    >
      {children}
    </a>
  )
}

export { Link, linkVariants }
