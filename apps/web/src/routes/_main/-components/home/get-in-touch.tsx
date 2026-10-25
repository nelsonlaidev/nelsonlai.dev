import { BlurImage } from '@repo/ui/components/blur-image'
import { buttonVariants } from '@repo/ui/components/button'
import { cn } from 'cn'
import { motion, useAnimate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

import { SITE } from '@/lib/site'
import { m } from '@/paraglide/messages'

const variants = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
}

export function GetInTouch() {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const isAnimationInView = useInView(scope)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!isAnimationInView) return

    const controls = animate(
      [
        ['[data-tech]', { opacity: 0.4 }, { duration: 0 }],
        ['[data-pointer]', { x: 200, y: 60 }, { duration: 0 }],
        ['[data-tech="javascript"]', { opacity: 1 }, { duration: 0 }],
        ['[data-pointer]', { x: 50, y: 102 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
        ['[data-tech="javascript"]', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['[data-tech="react"]', { opacity: 1 }, { duration: 0.3 }],
        ['[data-pointer]', { x: 224, y: 170 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
        ['[data-tech="react"]', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['[data-tech="typescript"]', { opacity: 1 }, { duration: 0.3 }],
        ['[data-pointer]', { x: 88, y: 198 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
        ['[data-tech="typescript"]', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['[data-tech="nextjs"]', { opacity: 1 }, { duration: 0.3 }],
        ['[data-pointer]', { x: 200, y: 60 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
        ['[data-tech="nextjs"]', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['[data-tech="javascript"]', { opacity: 1 }, { duration: 0.3 }],
      ],
      { repeat: Number.POSITIVE_INFINITY },
    )
    const motionPreference = globalThis.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePlayback = () => {
      if (motionPreference.matches) {
        controls.pause()
      } else {
        controls.play()
      }
    }

    updatePlayback()
    motionPreference.addEventListener('change', updatePlayback)

    return () => {
      motionPreference.removeEventListener('change', updatePlayback)
      controls.stop()
    }
  }, [animate, isAnimationInView])

  return (
    <motion.div
      className='relative flex flex-col justify-center gap-12 rounded-2xl p-5 shadow-feature-card md:flex-row'
      initial='initial'
      animate={reducedMotion || isInView ? 'animate' : 'initial'}
      variants={variants}
      ref={sectionRef}
      transition={{ duration: reducedMotion ? 0 : 0.5 }}
    >
      <div className='relative aspect-square w-64 max-w-full shrink-0 max-md:mx-auto' ref={scope}>
        <BlurImage
          src='/images/avatar.png'
          width={1024}
          height={1024}
          className='absolute top-1/2 left-1/2 size-20 -translate-1/2 rounded-3xl'
          alt=''
        />
        <div
          data-tech='nextjs'
          className='absolute bottom-12 left-14 rounded-4xl border bg-accent px-2 py-1.5 text-xs opacity-40'
        >
          Next.js
        </div>
        <div
          data-tech='react'
          className='absolute top-20 left-2 rounded-4xl border bg-accent px-2 py-1.5 text-xs opacity-40'
        >
          React.js
        </div>
        <div
          data-tech='typescript'
          className='absolute right-1 bottom-20 rounded-4xl border bg-accent px-2 py-1.5 text-xs opacity-40'
        >
          TypeScript
        </div>
        <div
          data-tech='javascript'
          className='absolute top-10 right-8 rounded-4xl border bg-accent px-2 py-1.5 text-xs opacity-40'
        >
          JavaScript
        </div>
        <motion.div
          data-pointer
          aria-hidden='true'
          initial={{ x: 200, y: 60 }}
          className='absolute top-0 left-0 motion-reduce:hidden'
        >
          <svg
            width='16.8'
            height='18.2'
            viewBox='0 0 12 13'
            className='fill-red-500'
            stroke='white'
            strokeWidth='1'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M12 5.50676L0 0L2.83818 13L6.30623 7.86537L12 5.50676V5.50676Z'
            />
          </svg>
          <span className='relative left-4 rounded-4xl bg-red-500 px-2 py-0.5 text-xs text-white'>Nelson</span>
        </motion.div>
      </div>
      <div className='flex min-w-0 flex-col justify-center px-4'>
        <h2 className='mb-2 text-3xl font-semibold'>{m.homepage_get_in_touch_title()}</h2>
        <p className='text-muted-foreground'>{m.homepage_get_in_touch_description()}</p>
        <div className='my-8'>
          <a
            href={`mailto:${SITE.email}`}
            className={cn(
              buttonVariants(),
              'bg-[linear-gradient(180deg,#d20a1e_5%,#ef5a5a_100%)] text-white motion-reduce:transition-none',
            )}
          >
            {SITE.email}
          </a>
        </div>
      </div>
    </motion.div>
  )
}
