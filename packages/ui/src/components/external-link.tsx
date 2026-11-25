import { cn } from 'cn'
import { ArrowRightIcon } from 'lucide-react'

type ExternalLinkProps = React.ComponentProps<'a'> & {
  href: string
}

export function ExternalLink(props: ExternalLinkProps) {
  const { children, className, target = '_blank', rel, ...rest } = props
  const safeRel = target === '_blank' ? [...new Set([...(rel?.match(/\S+/g) ?? []), 'noopener'])].join(' ') : rel

  return (
    <a
      data-slot='external-link'
      className={cn('group/external-link', className)}
      target={target}
      rel={safeRel}
      {...rest}
    >
      {children}
    </a>
  )
}

export function ExternalLinkArrow(props: { className?: string }) {
  return (
    <ArrowRightIcon
      aria-hidden='true'
      className={cn(
        '-rotate-45 motion-safe:transition-[rotate] motion-safe:ease-linear motion-safe:group-hover/external-link:rotate-0 motion-safe:group-focus-visible/external-link:rotate-0',
        props.className,
      )}
    />
  )
}
