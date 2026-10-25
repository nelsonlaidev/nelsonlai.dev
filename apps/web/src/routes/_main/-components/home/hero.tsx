import { BlurImage } from '@repo/ui/components/blur-image'
import { motion, useReducedMotion } from 'motion/react'

import { m } from '@/paraglide/messages'

export function Hero() {
  const reducedMotion = useReducedMotion()

  return (
    <div className='my-16 flex items-start justify-between gap-8'>
      <div className='min-w-0 flex-1 space-y-4'>
        <motion.h1
          className='max-w-md text-3xl/relaxed font-semibold text-balance'
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
        >
          {m.homepage_hero_intro()}
        </motion.h1>
        <motion.p
          className='text-sm text-muted-foreground'
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
        >
          {m.homepage_hero_location()}
        </motion.p>
      </div>
      <motion.div
        aria-hidden='true'
        className='relative hidden size-28 shrink-0 md:block'
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.3 }}
      >
        <BlurImage
          src='/images/avatar.png'
          className='size-28 rounded-full'
          width={1024}
          height={1024}
          alt=''
          lazy={false}
        />
        <div className='absolute inset-0 -z-10 bg-linear-to-tl from-purple-700 to-orange-700 opacity-50 blur-2xl' />
      </motion.div>
    </div>
  )
}
