'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import BlurImage from '@/components/blur-image'
import { MY_NAME } from '@/lib/constants'

const TEXTS = [
  {
    // i18n-check t('homepage.hero.amazing')
    key: 'amazing',
    className: 'bg-clip-text text-center text-transparent bg-linear-to-r from-[#ff1835] to-[#ffc900]',
  },
  {
    // i18n-check t('homepage.hero.stunning')
    key: 'stunning',
    className: 'bg-clip-text text-center text-transparent bg-linear-to-r from-[#0077ff] to-[#00e7df]',
  },
  {
    // i18n-check t('homepage.hero.fantastic')
    key: 'fantastic',
    className: 'bg-clip-text text-center text-transparent bg-linear-to-r from-[#7f00de] to-[#ff007f]',
  },
  {
    // i18n-check t('homepage.hero.attractive')
    key: 'attractive',
    className: 'bg-clip-text text-center text-transparent bg-linear-to-r from-[#2ecc70] to-[#1ca085]',
  },
] as const

const SPEED = 2

const variants = {
  enter: {
    y: 100,
    opacity: 0,
  },
  center: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -100,
    opacity: 0,
  },
}

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const t = useTranslations()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TEXTS.length)
    }, SPEED * 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const textItem = TEXTS[currentIndex]
  if (!textItem) return null

  return (
    <div className='my-16 space-y-6'>
      <div className='flex justify-between gap-8'>
        <div className='flex flex-col gap-4'>
          <h1 className='flex flex-col flex-wrap gap-2 text-xl font-semibold sm:text-3xl'>
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ ease: 'easeOut' }}>
              {t('homepage.hero.title-top')}
            </motion.div>
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ ease: 'easeOut' }}
              className='flex gap-2'
            >
              <motion.div layout key='title-middle-left'>
                {t('homepage.hero.title-middle-left')}
              </motion.div>
              <div className='relative overflow-hidden'>
                <AnimatePresence mode='popLayout'>
                  <motion.div
                    key={currentIndex}
                    variants={variants}
                    initial='enter'
                    animate='center'
                    exit='exit'
                    layout
                    transition={{
                      type: 'tween',
                      duration: 0.3,
                    }}
                    className='inline-flex items-center justify-center'
                  >
                    <span className={textItem.className}>{t(`homepage.hero.${textItem.key}`)}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
              <motion.div layout key='title-middle-right'>
                {t('homepage.hero.title-middle-right')}
              </motion.div>
            </motion.div>
            <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ ease: 'easeOut' }}>
              {t('homepage.hero.title-bottom')}
            </motion.div>
          </h1>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ease: 'easeOut' }}
            className='text-sm text-muted-foreground'
          >
            {t('homepage.hero.location-timezone')}
          </motion.div>
        </div>
        <motion.div
          className='relative hidden size-28 md:block'
          initial={{
            scale: 0,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <BlurImage
            src='/images/avatar.png'
            className='size-28 rounded-full'
            width={1024}
            height={1024}
            alt={`${MY_NAME}'s Logo`}
            lazy={false}
          />
          <div className='absolute inset-0 -z-10 bg-linear-to-tl from-purple-700 to-orange-700 opacity-50 blur-2xl' />
        </motion.div>
      </div>
    </div>
  )
}

export default Hero
