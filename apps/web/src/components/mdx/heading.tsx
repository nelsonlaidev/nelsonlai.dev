import { cn } from 'cn'
import { LinkIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

type HeadingProps = React.ComponentProps<'h2'> & {
  as: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function Heading(props: HeadingProps) {
  const { as: Component, children, className, id, ...rest } = props

  return (
    <Component id={id} className={cn('group scroll-m-32', className)} {...rest}>
      {children}
      {id && (
        <a
          href={`#${id}`}
          aria-label={m.mdx_link_to_section()}
          className='ml-2 inline-flex text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 motion-reduce:transition-none'
        >
          <LinkIcon aria-hidden='true' className='size-4' />
        </a>
      )}
    </Component>
  )
}
