import { AspectRatio as AspectRatioPrimitive } from 'radix-ui'

type AspectRatioProps = React.ComponentProps<typeof AspectRatioPrimitive.Root>

const AspectRatio = (props: AspectRatioProps) => {
  return <AspectRatioPrimitive.Root data-slot='aspect-ratio' {...props} />
}

export { AspectRatio }
