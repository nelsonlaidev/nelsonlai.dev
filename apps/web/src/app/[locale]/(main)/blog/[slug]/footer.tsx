'use client'

import type { Post } from '@/lib/content'

import { useTranslations } from '@repo/i18n/client'
import { linkVariants } from '@repo/ui/components/link'

import Link from '@/components/link'
import { useFormattedDate } from '@/hooks/use-formatted-date'

type FooterProps = {
  post: Post
}

const Footer = (props: FooterProps) => {
  const { post } = props
  const t = useTranslations()

  const editURL = `https://github.com/nelsonlaidev/nelsonlai.dev/blob/main/${post.sourceFilePath}?plain=1`

  const formattedDate = useFormattedDate(post.modifiedTime)

  return (
    <div className='my-8 flex w-full items-center justify-between py-4 text-sm'>
      <Link href={editURL} className={linkVariants({ variant: 'muted' })}>
        {t('blog.footer.edit-on-github')}
      </Link>
      <div className='text-muted-foreground'>{t('blog.footer.last-updated', { date: formattedDate })}</div>
    </div>
  )
}

export default Footer
