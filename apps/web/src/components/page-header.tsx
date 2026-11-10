import { cn } from 'cn'

type PageHeaderProps = {
  title: string
  description: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function PageHeader(props: PageHeaderProps) {
  const { title, description, children, className } = props

  return (
    <header className={cn('mb-16 sm:mb-28', className)}>
      <h1 className='text-5xl tracking-tighter lg:text-6xl xl:text-7xl'>
        {title}
        <span aria-hidden='true' className='text-primary'>
          .
        </span>
      </h1>
      <p className='mt-6 text-lg/relaxed whitespace-pre-line text-muted-foreground'>{description}</p>
      {children}
    </header>
  )
}
