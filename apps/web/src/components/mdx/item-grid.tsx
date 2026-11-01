// Inspired by: https://jahir.dev/uses
import { BlurImage } from '@repo/ui/components/blur-image'
import { ExternalLink } from '@repo/ui/components/external-link'

type ItemGridProps = {
  items: Array<{
    image: string
    name: string
    description: string
    url: string
  }>
}

export function ItemGrid(props: ItemGridProps) {
  const { items } = props

  return (
    <div className='not-prose mb-9 grid grid-cols-1 gap-4 sm:grid-cols-4'>
      {items.map((item) => (
        <ExternalLink
          key={item.name}
          href={item.url}
          className='flex min-w-0 gap-6 rounded-xl border p-4 transition-colors hover:bg-accent motion-reduce:transition-none sm:flex-col sm:gap-3'
        >
          <BlurImage
            src={item.image}
            width={256}
            height={256}
            alt={item.name}
            className='shrink-0'
            imageClassName='size-24 sm:size-full'
          />
          <div className='flex min-w-0 flex-col justify-center gap-2 wrap-break-word'>
            <div className='text-lg font-semibold'>{item.name}</div>
            <div className='text-sm text-muted-foreground'>{item.description}</div>
          </div>
        </ExternalLink>
      ))}
    </div>
  )
}
