import { Marquee } from '@repo/ui/components/marquee'

const items = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew']

function MarqueeDemo() {
  return (
    <Marquee>
      {items.map((item) => (
        <div key={item} className='flex h-12 items-center justify-center rounded-lg border px-4'>
          {item}
        </div>
      ))}
    </Marquee>
  )
}

export default MarqueeDemo
