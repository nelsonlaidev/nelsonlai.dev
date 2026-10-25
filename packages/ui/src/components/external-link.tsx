type ExternalLinkProps = React.ComponentProps<'a'> & {
  href: string
}

export function ExternalLink(props: ExternalLinkProps) {
  const { children, target = '_blank', rel, ...rest } = props
  const safeRel = target === '_blank' ? [...new Set([...(rel?.match(/\S+/g) ?? []), 'noopener'])].join(' ') : rel

  return (
    <a data-slot='external-link' target={target} rel={safeRel} {...rest}>
      {children}
    </a>
  )
}
