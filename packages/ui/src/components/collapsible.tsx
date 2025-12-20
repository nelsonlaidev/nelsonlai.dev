import { Collapsible as CollapsiblePrimitive } from 'radix-ui'

type CollapsibleProps = React.ComponentProps<typeof CollapsiblePrimitive.Root>

function Collapsible(props: CollapsibleProps) {
  return <CollapsiblePrimitive.Root data-slot='collapsible' {...props} />
}

type CollapsibleTriggerProps = React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>

function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  return <CollapsiblePrimitive.CollapsibleTrigger data-slot='collapsible-trigger' {...props} />
}

type CollapsibleContentProps = React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>

function CollapsibleContent(props: CollapsibleContentProps) {
  return <CollapsiblePrimitive.CollapsibleContent data-slot='collapsible-content' {...props} />
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
