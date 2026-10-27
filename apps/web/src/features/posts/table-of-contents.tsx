import type { TOC } from '@repo/mdx-plugins'

import { Button } from '@repo/ui/components/button'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover'
import { SegmentGroup, SegmentGroupItem } from '@repo/ui/components/segment-group'
import { useNavigate } from '@tanstack/react-router'
import { AlignLeftIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { m } from '@/paraglide/messages'

type TableOfContentsProps = {
  toc: TOC[]
}

export function TableOfContents(props: TableOfContentsProps) {
  const { toc } = props
  const [activeId, setActiveId] = useState<string>()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '0% 0% -80% 0%' },
    )

    for (const item of toc) {
      const element = document.querySelector(`#${CSS.escape(item.url)}`)
      if (element) observer.observe(element)
    }

    return () => {
      observer.disconnect()
    }
  }, [toc])

  if (toc.length === 0) return null

  return (
    <>
      <nav aria-label={m.blog_on_this_page()} className='hidden max-h-[60vh] overflow-y-auto pl-4 lg:block'>
        <div className='mb-4'>{m.blog_on_this_page()}</div>
        <SegmentGroup
          orientation='vertical'
          value={activeId}
          onValueChange={(details) => {
            if (details.value) void navigate({ hash: details.value })
          }}
          className='bg-transparent'
          aria-label={m.blog_on_this_page()}
        >
          {toc.map((item) => (
            <SegmentGroupItem key={item.url} value={item.url} style={{ paddingLeft: (item.depth - 1) * 12 }}>
              {item.title}
            </SegmentGroupItem>
          ))}
        </SegmentGroup>
      </nav>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button variant='secondary' className='fixed right-2 bottom-2 z-50 lg:hidden' />}>
          <AlignLeftIcon aria-hidden='true' />
          {m.blog_on_this_page()}
        </PopoverTrigger>
        <PopoverContent
          align='end'
          side='top'
          className='max-h-[60vh] max-w-[90vw] overflow-y-auto px-0 py-2'
          aria-label={m.blog_on_this_page()}
        >
          {toc.map((item) => (
            <a
              key={item.url}
              href={`#${encodeURIComponent(item.url)}`}
              className='block py-2 pr-2.5 text-sm/tight text-muted-foreground transition-colors hover:text-foreground'
              style={{ paddingLeft: (item.depth - 1) * 16 }}
              onClick={() => {
                setOpen(false)
              }}
            >
              {item.title}
            </a>
          ))}
        </PopoverContent>
      </Popover>
    </>
  )
}
