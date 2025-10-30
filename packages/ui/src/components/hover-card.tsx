import { HoverCard as HoverCardPrimitive } from 'radix-ui'

import { cn } from '../utils/cn'

type HoverCardProps = React.ComponentProps<typeof HoverCardPrimitive.Root>

const HoverCard = (props: HoverCardProps) => {
  return <HoverCardPrimitive.Root data-slot='hover-card' {...props} />
}

type HoverCardTriggerProps = React.ComponentProps<typeof HoverCardPrimitive.Trigger>

const HoverCardTrigger = (props: HoverCardTriggerProps) => {
  return <HoverCardPrimitive.Trigger data-slot='hover-card-trigger' {...props} />
}

type HoverCardContentProps = React.ComponentProps<typeof HoverCardPrimitive.Content>

const HoverCardContent = (props: HoverCardContentProps) => {
  const { className, align = 'center', sideOffset = 4, ...rest } = props

  return (
    <HoverCardPrimitive.Portal data-slot='hover-card-portal'>
      <HoverCardPrimitive.Content
        data-slot='hover-card-content'
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'data-[side=top]:slide-in-from-bottom-2',
          'data-[side=right]:slide-in-from-left-2',
          'data-[side=bottom]:slide-in-from-top-2',
          'data-[side=left]:slide-in-from-right-2',
          className
        )}
        {...rest}
      />
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardContent, HoverCardTrigger }
