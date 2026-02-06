import { cn } from '@/utils/cn'

type DemoProps = {
  title: string
  children: React.ReactNode
} & React.ComponentProps<'div'>

function Demo(props: DemoProps) {
  const { title, children, className, ...rest } = props

  return (
    <section data-slot='demo' className='flex flex-col gap-4'>
      <h2 className='text-2xl font-medium'>{title}</h2>
      <div className={cn('grid gap-6 md:grid-cols-2', className)} {...rest}>
        {children}
      </div>
    </section>
  )
}

type DemoItem = {
  title?: string
  orientation?: 'horizontal' | 'vertical'
} & React.ComponentProps<'div'>

function DemoItem(props: DemoItem) {
  const { title, orientation = 'horizontal', className, children } = props

  return (
    <div data-slot='demo-item' className='min-w-0'>
      {title && <div className='px-1.5 py-2 text-xs font-medium text-muted-foreground'>{title}</div>}
      <div
        data-slot='demo-item-content'
        data-orientation={orientation}
        className={cn(
          'flex flex-wrap rounded-4xl border border-dashed p-4 sm:p-6 data-horizontal:gap-2 data-vertical:flex-col data-vertical:gap-6',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export { Demo, DemoItem }
