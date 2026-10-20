'use client'

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import { cn } from 'cn'

import { hintArrowClassName, hintPopupClassName } from './tooltip-styles'

type TooltipProviderProps = TooltipPrimitive.Provider.Props

export function TooltipProvider(props: TooltipProviderProps) {
  const { delay = 0, ...rest } = props

  return <TooltipPrimitive.Provider data-slot='tooltip-provider' delay={delay} {...rest} />
}

type TooltipProps = TooltipPrimitive.Root.Props

export function Tooltip(props: TooltipProps) {
  return <TooltipPrimitive.Root data-slot='tooltip' {...props} />
}

type TooltipTriggerProps = TooltipPrimitive.Trigger.Props

export function TooltipTrigger(props: TooltipTriggerProps) {
  return <TooltipPrimitive.Trigger data-slot='tooltip-trigger' {...props} />
}

type TooltipContentProps = TooltipPrimitive.Popup.Props &
  Pick<TooltipPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>

export function TooltipContent(props: TooltipContentProps) {
  const { className, side = 'top', sideOffset = 4, align = 'center', alignOffset = 0, children, ...rest } = props

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className='isolate z-50'
      >
        <TooltipPrimitive.Popup
          data-slot='tooltip-content'
          className={cn(
            hintPopupClassName,
            'has-data-[slot=kbd]:pr-1.5',
            '**:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-4xl',
            'data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95',
            className,
          )}
          {...rest}
        >
          {children}
          <TooltipPrimitive.Arrow className={hintArrowClassName} />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}
