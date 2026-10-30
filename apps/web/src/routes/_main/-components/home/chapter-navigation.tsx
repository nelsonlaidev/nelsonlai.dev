import { cn } from 'cn'
import { useEffect, useState } from 'react'

import { m } from '@/paraglide/messages'

const CHAPTERS = [
  { id: 'surface', label: m.nav_home },
  { id: 'discoveries', label: m.nav_projects },
  { id: 'notes', label: m.nav_blog },
  { id: 'about', label: m.nav_about },
  { id: 'guestbook', label: m.nav_guestbook },
]

export function ChapterNavigation() {
  const [active, setActive] = useState('surface')
  const [depth, setDepth] = useState(0)

  useEffect(() => {
    let frame = 0
    const updateDepth = () => {
      frame = 0
      setDepth(
        Math.round(
          Math.min(
            1,
            Math.max(0, window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)),
          ) * 240,
        ),
      )
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(updateDepth)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-35% 0px -40% 0px', threshold: 0 },
    )
    for (const chapter of CHAPTERS) {
      const section = document.querySelector(`#${chapter.id}`)
      if (section) observer.observe(section)
    }
    const resize = new ResizeObserver(schedule)
    resize.observe(document.documentElement)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resize.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  let depthLabel = m.ocean_quiet()
  if (active === 'surface' || active === 'discoveries') depthLabel = m.ocean_sunlit()
  else if (active === 'guestbook') depthLabel = m.ocean_floor()

  return (
    <>
      <nav
        aria-label={m.ocean_chapters()}
        className='fixed top-1/2 right-2.5 z-30 flex -translate-y-1/2 flex-col gap-1.75 min-[701px]:right-7.75 min-[701px]:gap-2.5'
      >
        {CHAPTERS.map((chapter) => (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            aria-current={active === chapter.id ? 'location' : undefined}
            className='group flex h-6.25 items-center justify-end gap-2.5'
          >
            <span className='sr-only rounded-sm bg-background/90 px-2 py-1 text-xs group-hover:not-sr-only group-focus-visible:not-sr-only'>
              {chapter.label()}
            </span>
            <span
              className={cn(
                'h-px w-1.75 bg-muted-foreground transition-[width] motion-reduce:transition-none min-[701px]:w-3',
                active === chapter.id && 'w-3.5 bg-primary min-[701px]:w-6',
              )}
              aria-hidden='true'
            />
          </a>
        ))}
      </nav>
      <div
        aria-hidden='true'
        className='pointer-events-none fixed right-3 bottom-5 z-20 rounded-sm bg-background/75 p-1.75 text-xs text-muted-foreground min-[701px]:right-auto min-[701px]:bottom-9 min-[701px]:left-6 min-[701px]:bg-transparent min-[701px]:p-0 min-[701px]:[writing-mode:vertical-rl]'
      >
        {String(depth).padStart(3, '0')} m <span className='hidden min-[701px]:inline'>{depthLabel}</span>
      </div>
    </>
  )
}
