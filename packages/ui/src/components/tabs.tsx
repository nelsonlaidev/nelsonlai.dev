import { Tabs as TabsPrimitive } from 'radix-ui'

import { cn } from '../utils/cn'

type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root>

const Tabs = (props: TabsProps) => {
  const { className, ...rest } = props

  return <TabsPrimitive.Root data-slot='tabs' className={cn('flex flex-col gap-2', className)} {...rest} />
}

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List>

const TabsList = (props: TabsListProps) => {
  const { className, ...rest } = props

  return (
    <TabsPrimitive.List
      data-slot='tabs-list'
      className={cn(
        'inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground',
        className
      )}
      {...rest}
    />
  )
}

type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger>

const TabsTrigger = (props: TabsTriggerProps) => {
  const { className, ...rest } = props

  return (
    <TabsPrimitive.Trigger
      data-slot='tabs-trigger'
      className={cn(
        'inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground transition-[color,box-shadow]',
        'dark:text-muted-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-background data-[state=active]:shadow-sm',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...rest}
    />
  )
}

type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content>

const TabsContent = (props: TabsContentProps) => {
  const { className, ...rest } = props

  return <TabsPrimitive.Content data-slot='tabs-content' className={cn('flex-1 outline-none', className)} {...rest} />
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
