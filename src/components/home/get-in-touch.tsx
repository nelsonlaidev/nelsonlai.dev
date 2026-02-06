'use client'

import { motion, useAnimate, useInView } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'

import BlurImage from '@/components/blur-image'
import { cn } from '@/utils/cn'

import { buttonVariants } from '../ui/button'

const variants = {
  initial: {
    y: 40,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
}

function GetInTouch() {
  const [scope, animate] = useAnimate()
  const cardsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardsRef, { once: true, margin: '-100px' })
  const t = useTranslations()

  useEffect(() => {
    animate(
      [
        ['#pointer', { left: 200, top: 60 }, { duration: 0 }],
        ['#javascript', { opacity: 1 }, { duration: 0 }],
        ['#pointer', { left: 50, top: 102 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
        ['#javascript', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['#react-js', { opacity: 1 }, { duration: 0.3 }],
        ['#pointer', { left: 224, top: 170 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
        ['#react-js', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['#typescript', { opacity: 1 }, { duration: 0.3 }],
        ['#pointer', { left: 88, top: 198 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
        ['#typescript', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['#next-js', { opacity: 1 }, { duration: 0.3 }],
        ['#pointer', { left: 200, top: 60 }, { at: '+0.5', duration: 0.5, ease: 'easeInOut' }],
        ['#next-js', { opacity: 0.4 }, { at: '-0.3', duration: 0.1 }],
        ['#javascript', { opacity: 1 }, { duration: 0.3 }],
      ],
      { repeat: Number.POSITIVE_INFINITY },
    )
  }, [animate])

  return (
    <motion.div
      className='relative flex flex-col justify-center gap-12 rounded-2xl p-5 shadow-feature-card md:flex-row'
      initial='initial'
      animate={isInView ? 'animate' : 'initial'}
      variants={variants}
      ref={cardsRef}
      transition={{
        duration: 0.5,
      }}
    >
      <div className='relative size-64 max-md:mx-auto' ref={scope}>
        <BlurImage
          src='/images/avatar.png'
          width={1024}
          height={1024}
          className='absolute top-1/2 left-1/2 size-20 -translate-1/2 rounded-3xl'
          alt={t('homepage.get-in-touch.image-alt')}
        />
        <div
          id='next-js'
          className='absolute bottom-12 left-14 rounded-4xl border bg-accent px-2 py-1.5 text-xs opacity-40'
        >
          Next.js
        </div>
        <div
          id='react-js'
          className='absolute top-20 left-2 rounded-4xl border bg-accent px-2 py-1.5 text-xs opacity-40'
        >
          React.js
        </div>
        <div
          id='typescript'
          className='absolute right-1 bottom-20 rounded-4xl border bg-accent px-2 py-1.5 text-xs opacity-40'
        >
          TypeScript
        </div>
        <div
          id='javascript'
          className='absolute top-10 right-8 rounded-4xl border bg-accent px-2 py-1.5 text-xs opacity-40'
        >
          JavaScript
        </div>

        <div id='pointer' className='absolute'>
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
        </div>
      </div>

      <div className='flex flex-col justify-center px-4'>
        <p className='mb-2 text-3xl font-semibold'>{t('homepage.get-in-touch.title')}</p>
        <p className='text-muted-foreground'>{t('homepage.get-in-touch.description')}</p>
        <div className='my-8'>
          <a href='mailto:me@nelsonlai.dev' className={cn(buttonVariants(), 'bg-email-button text-white')}>
            me@nelsonlai.dev
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default GetInTouch
