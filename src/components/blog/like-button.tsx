'use client'

// Inspired by: https://framer.university/resources/like-button-component
import NumberFlow from '@number-flow/react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'

import { Separator } from '@/components/ui/separator'
import { useCountLike, useIncrementLike } from '@/hooks/queries/like.query'

type LikeButtonProps = {
  slug: string
}

function LikeButton(props: LikeButtonProps) {
  const { slug } = props
  const [cacheCount, setCacheCount] = useState(0)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const t = useTranslations()

  const { data, isSuccess, isLoading, isError } = useCountLike({ slug })
  const { mutate: likePost } = useIncrementLike({ slug })

  async function showConfettiAnimation() {
    const { clientWidth, clientHeight } = document.documentElement
    const boundingBox = buttonRef.current?.getBoundingClientRect()

    const targetY = boundingBox?.y ?? 0
    const targetX = boundingBox?.x ?? 0
    const targetWidth = boundingBox?.width ?? 0

    const targetCenterX = targetX + targetWidth / 2
    const { default: confetti } = await import('canvas-confetti')

    await confetti({
      zIndex: 999,
      particleCount: 100,
      spread: 100,
      origin: {
        y: targetY / clientHeight,
        x: targetCenterX / clientWidth,
      },
      shapes: [confetti.shapeFromText({ text: '❤️', scalar: 2 })],
    })
  }

  const onLikeSaving = useDebouncedCallback((value: number) => {
    likePost({ slug, value })
    setCacheCount(0)
  }, 1000)

  function handleLikeButtonClick() {
    if (isLoading || !data) return
    if (data.currentUserLikes + cacheCount >= 3) {
      toast.error(t('error.like-limit-reached'))
      return
    }

    const value = cacheCount === 3 ? cacheCount : cacheCount + 1
    setCacheCount(value)

    if (data.currentUserLikes + cacheCount === 2) {
      void showConfettiAnimation()
    }

    return onLikeSaving(value)
  }

  return (
    <div className='mt-12 mb-4 flex justify-center'>
      <motion.button
        ref={buttonRef}
        className='flex items-center gap-3 rounded-4xl bg-primary px-4 py-2 text-lg text-white dark:bg-primary/5'
        onClick={handleLikeButtonClick}
        aria-label={t('blog.like-this-post')}
        whileTap={{ scale: 0.96 }}
        type='button'
        data-testid='like-button'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='28'
          height='28'
          viewBox='0 0 24 24'
          strokeWidth='2'
          stroke='#ef4444'
          className='relative overflow-hidden'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <defs>
            <clipPath id='clip-path'>
              <path d='M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572' />
            </clipPath>
          </defs>
          <path d='M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572' />
          <g clipPath='url(#clip-path)'>
            <motion.rect
              x='0'
              y='0'
              width='24'
              height='24'
              fill='#ef4444'
              initial={{
                y: '100%',
              }}
              animate={{
                y: data ? `${100 - (data.currentUserLikes + cacheCount) * 33}%` : '100%',
              }}
            />
          </g>
        </svg>
        {t('common.like')}
        <Separator orientation='vertical' className='bg-accent/20 dark:bg-accent' />
        {isSuccess && <NumberFlow value={data.likes + cacheCount} data-testid='like-count' />}
        {isLoading && <div>--</div>}
        {isError && <div>{t('common.error')}</div>}
      </motion.button>
    </div>
  )
}

export default LikeButton
