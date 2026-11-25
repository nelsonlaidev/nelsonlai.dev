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
    <header className={cn('mb-16', className)}>
      <h1 className='mb-6 text-5xl tracking-tight lg:text-6xl xl:text-7xl'>
        {title}
        <span aria-hidden='true' className='text-primary'>
          .
        </span>
      </h1>
      <p className='text-lg/relaxed whitespace-pre-line text-muted-foreground'>{description}</p>
      {children}
    </header>
  )
}
