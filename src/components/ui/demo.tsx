import { cn } from '@/utils/cn'

type DemoProps = {
  title: string
  children: React.ReactNode
} & React.ComponentProps<'div'>

export function Demo(props: DemoProps) {
  const { title, children, className, ...rest } = props

  return (
    <div data-slot='demo' className='flex flex-col gap-4'>
      <h2 className='text-2xl font-medium'>{title}</h2>
      <div className={cn('space-y-6', className)} {...rest}>
        {children}
      </div>
    </div>
  )
}

type DemoItem = {
  title?: string
  orientation?: 'horizontal' | 'vertical'
} & React.ComponentProps<'div'>

export function DemoItem(props: DemoItem) {
  const { title, orientation = 'horizontal', className, children } = props

  return (
    <div data-slot='demo-item' className='min-w-0'>
      {title && <h3 className='px-1.5 py-2 text-xs font-medium text-muted-foreground'>{title}</h3>}
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
