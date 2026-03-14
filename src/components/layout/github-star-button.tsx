import { StarIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useGithubStats } from '@/hooks/queries/stats.query'
import { useFormatNumber } from '@/hooks/use-format-number'

import { Link } from '../ui/link'
import { Separator } from '../ui/separator'

export function GithubStarButton() {
  const { data, isSuccess, isLoading, isError } = useGithubStats()
  const t = useTranslations()
  const format = useFormatNumber()

  return (
    <Link
      href='https://github.com/nelsonlaidev/nelsonlai.dev'
      className='flex items-center overflow-hidden rounded-4xl border'
    >
      <div className='flex h-8 items-center gap-2 bg-muted pr-2 pl-3 font-medium'>
        <StarIcon className='size-4' /> Star
      </div>
      <Separator orientation='vertical' />
      <div className='flex h-8 items-center bg-background pr-3 pl-2'>
        {isSuccess && format(data.repoStars)}
        {isLoading && '--'}
        {isError && t('common.error')}
      </div>
    </Link>
  )
}
