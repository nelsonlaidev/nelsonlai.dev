import { Item, ItemContent, ItemMedia, ItemTitle } from '@repo/ui/components/item'
import { Spinner } from '@repo/ui/components/spinner'

const SpinnerDemo = () => {
  return (
    <div className='flex w-full max-w-xs flex-col gap-4 [--radius:1rem]'>
      <Item variant='muted'>
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className='line-clamp-1'>Processing payment...</ItemTitle>
        </ItemContent>
        <ItemContent className='flex-none justify-end'>
          <span className='text-sm tabular-nums'>$100.00</span>
        </ItemContent>
      </Item>
    </div>
  )
}

export default SpinnerDemo
