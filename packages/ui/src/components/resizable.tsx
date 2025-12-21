'use client'

import { GripVerticalIcon } from 'lucide-react'
import * as ResizablePrimitive from 'react-resizable-panels'

import { cn } from '../utils/cn'

type ResizablePanelGroupProps = React.ComponentProps<typeof ResizablePrimitive.Group>

function ResizablePanelGroup(props: ResizablePanelGroupProps) {
  const { className, ...rest } = props

  return (
    <ResizablePrimitive.Group
      data-slot='resizable-panel-group'
      className={cn('flex size-full', 'aria-[orientation=vertical]:flex-col', className)}
      {...rest}
    />
  )
}

type ResizablePanelProps = React.ComponentProps<typeof ResizablePrimitive.Panel>

function ResizablePanel(props: ResizablePanelProps) {
  return <ResizablePrimitive.Panel data-slot='resizable-panel' {...props} />
}

type ResizableSeparatorProps = React.ComponentProps<typeof ResizablePrimitive.Separator> & {
  withHandle?: boolean
}

function ResizableSeparator(props: ResizableSeparatorProps) {
  const { withHandle, className, ...rest } = props

  return (
    <ResizablePrimitive.Separator
      data-slot='resizable-separator'
      className={cn(
        'relative flex w-px items-center justify-center bg-border',
        'focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-hidden',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
        'aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2',
        '[&[data-orientation=horizontal]>div]:rotate-90',
        className
      )}
      {...rest}
    >
      {withHandle && (
        <div className='z-10 flex h-4 w-3 items-center justify-center rounded-xs border bg-border'>
          <GripVerticalIcon className='size-2.5' />
        </div>
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizablePanel, ResizablePanelGroup, ResizableSeparator }
