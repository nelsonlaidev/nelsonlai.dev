// Inspired by: https://jahir.dev/uses
import BlurImage from '@/components/blur-image'
import { Link } from '@/components/ui/link'

type Items = Array<{
  image: string
  name: string
  description: string
  url: string
}>

type ItemGridProps = {
  items: Items
}

function ItemGrid(props: ItemGridProps) {
  const { items } = props

  return (
    <div className='not-prose mb-9 grid grid-cols-1 gap-4 sm:grid-cols-4'>
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.url}
          className='flex gap-6 rounded-xl border p-4 transition-colors hover:bg-accent sm:flex-col sm:gap-3'
        >
          <BlurImage
            src={item.image}
            width={256}
            height={256}
            alt={item.name}
            className='shrink-0'
            imageClassName='m-0 size-24 sm:size-full'
          />
          <div className='flex flex-col justify-center gap-2'>
            <div className='text-lg font-semibold'>{item.name}</div>
            <div className='text-sm text-muted-foreground'>{item.description}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ItemGrid
