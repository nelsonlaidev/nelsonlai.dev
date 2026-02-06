import { Badge } from '../ui/badge'
import { Demo, DemoItem } from '../ui/demo'
import { Marquee } from '../ui/marquee'

const tags = ['Next.js', 'TypeScript', 'Tailwind', 'Design Systems', 'Motion', 'Accessibility', 'Performance', 'SEO']

const updates = [
  { title: 'Design review', time: 'Today · 2:00 PM' },
  { title: 'Release checklist', time: 'Tomorrow · 9:00 AM' },
  { title: 'Content pass', time: 'Thu · 1:30 PM' },
  { title: 'QA sweep', time: 'Fri · 11:00 AM' },
  { title: 'Launch prep', time: 'Fri · 4:00 PM' },
]

function MarqueeDemo() {
  return (
    <Demo title='Marquee'>
      <MarqueeHorizontal />
      <MarqueeVertical />
    </Demo>
  )
}

function MarqueeHorizontal() {
  return (
    <DemoItem title='Horizontal'>
      <div className='w-full overflow-hidden rounded-xl border bg-card p-4'>
        <Marquee gap='16px' className='py-2'>
          {tags.map((tag) => (
            <Badge key={tag} variant='secondary'>
              {tag}
            </Badge>
          ))}
        </Marquee>
      </div>
    </DemoItem>
  )
}

function MarqueeVertical() {
  return (
    <DemoItem title='Vertical' className='justify-center'>
      <div className='h-64 w-full max-w-xs overflow-hidden rounded-xl border bg-card p-4'>
        <Marquee direction='up' duration={18} gap='12px' className='h-full'>
          {updates.map((update) => (
            <div key={update.title} className='rounded-lg border bg-background px-3 py-2 text-sm'>
              <div className='font-medium'>{update.title}</div>
              <div className='text-xs text-muted-foreground'>{update.time}</div>
            </div>
          ))}
        </Marquee>
      </div>
    </DemoItem>
  )
}

export default MarqueeDemo
