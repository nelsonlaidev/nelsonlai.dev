import { cn } from 'cn'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

import { m } from '@/paraglide/messages'

const WORDS = [
  { word: m.hero_amazing, className: 'from-red-700 to-amber-800 dark:from-rose-400 dark:to-yellow-400' },
  { word: m.hero_stunning, className: 'from-blue-700 to-cyan-800 dark:from-blue-400 dark:to-teal-300' },
  { word: m.hero_fantastic, className: 'from-purple-700 to-pink-800 dark:from-purple-400 dark:to-pink-300' },
  { word: m.hero_attractive, className: 'from-green-800 to-teal-800 dark:from-green-300 dark:to-teal-300' },
] as const

export function Hero() {
  return (
    <div className='my-16 flex items-start justify-between gap-8'>
      <Introduction />
      <Avatar />
    </div>
  )
}

function Introduction() {
  const [index, setIndex] = useState(0)
  const reducedMotion = useReducedMotion()
  const playing = !reducedMotion

  useEffect(() => {
    if (!playing) return

    const interval = setInterval(() => {
      setIndex((previous) => (previous + 1) % WORDS.length)
    }, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [playing])

  const word = WORDS[reducedMotion ? 0 : index] ?? WORDS[0]
  const wordClassName = cn('col-start-1 row-start-1 bg-linear-to-r bg-clip-text text-transparent', word.className)

  return (
    <div className='min-w-0 flex-1 space-y-4'>
      <h1 aria-label={m.hero_heading()} className='space-y-2 text-xl font-semibold sm:text-3xl'>
        <span aria-hidden='true' className='block'>
          {m.hero_intro()}
        </span>
        <span aria-hidden='true' className='block'>
          {m.hero_description.parts().map((part) => {
            if (part.type === 'text') return part.value
            if (part.type !== 'markup-standalone' || part.name !== 'quality') return null

            return (
              <span key={part.name} className='relative inline-grid overflow-hidden align-bottom'>
                {playing ? (
                  <AnimatePresence mode='popLayout' initial={false}>
                    <motion.span
                      key={word.word()}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: '-100%', opacity: 0 }}
                      transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
                      className={wordClassName}
                    >
                      {word.word()}
                    </motion.span>
                  </AnimatePresence>
                ) : (
                  <span className={wordClassName}>{word.word()}</span>
                )}
              </span>
            )
          })}
        </span>
        <span aria-hidden='true' className='block'>
          React
        </span>
      </h1>
      <p className='text-sm text-muted-foreground'>{m.hero_location()}</p>
    </div>
  )
}

function Avatar() {
  return (
    <div aria-hidden='true' className='relative hidden size-28 shrink-0 md:block'>
      <img src='/images/avatar.png' className='size-28 rounded-full' width={1024} height={1024} alt='' />
      <div className='absolute inset-0 -z-10 bg-linear-to-tl from-purple-700 to-orange-700 opacity-50 blur-2xl' />
    </div>
  )
}
