'use client'

import { Link } from '@repo/ui/components/link'
import { StarIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { FOOTER_LINKS } from '@/config/links'
import { useGitHubStat } from '@/hooks/queries/stat.query'

import LocaleSwitcher from './locale-switcher'
import NowPlaying from './now-playing'

const LayoutFooter = () => {
  const { isSuccess, isLoading, isError, data } = useGitHubStat()
  const t = useTranslations()

  return (
    <footer className='relative mx-auto mb-6 flex w-full max-w-5xl flex-col rounded-2xl bg-background/30 p-8 shadow-xs saturate-100 backdrop-blur-md'>
      <NowPlaying />
      <div className='mt-12 grid grid-cols-2 sm:grid-cols-3'>
        {FOOTER_LINKS.map((list) => (
          <div key={list.id} className='mb-10 flex flex-col items-start gap-4 pr-4'>
            {list.links.map((link) => {
              const { href, labelKey } = link

              return (
                <Link key={href} href={href} variant='muted'>
                  {t(labelKey)}
                </Link>
              )
            })}
          </div>
        ))}
      </div>
      <div className='mt-20 flex flex-col gap-4'>
        <LocaleSwitcher />
        <div className='flex items-center justify-between text-sm'>
          <div>&copy; {new Date().getFullYear()} Nelson Lai</div>
          <Link
            href='https://nelsonlai.link/s/github-portfolio'
            className='flex items-center justify-center overflow-hidden rounded-md border'
          >
            <div className='flex h-8 items-center gap-2 border-r bg-muted px-2'>
              <StarIcon className='size-4' />
              <span className='font-medium'>Star</span>
            </div>
            <div className='flex h-8 items-center bg-background px-3'>
              {isSuccess &&
                Intl.NumberFormat('en', {
                  notation: 'compact',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 1
                }).format(data.repoStars)}
              {isLoading && '--'}
              {isError && t('common.error')}
            </div>
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default LayoutFooter
