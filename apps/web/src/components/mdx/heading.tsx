import { cn } from 'cn'
import { LinkIcon } from 'lucide-react'

type HeadingProps = React.ComponentProps<'h2'> & {
  as: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function Heading(props: HeadingProps) {
  const { as: Component, children, className, id, ...rest } = props

  return (
    <Component id={id} className={cn('scroll-m-32', className)} {...rest}>
      {id ? (
        <a
          href={`#${id}`}
          className='group rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring'
        >
          {children}
          <LinkIcon
            aria-hidden='true'
            className='ml-2 inline size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none'
          />
        </a>
      ) : (
        children
      )}
    </Component>
  )
}
