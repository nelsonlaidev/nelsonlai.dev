'use client'

import type { Post } from 'content-collections'

import { useLocale, useTranslations } from 'next-intl'

import { Link } from '@/components/ui/link'
import { useFormattedDate } from '@/hooks/use-formatted-date'

type BlogFooterProps = {
  post: Post
}

function BlogFooter(props: BlogFooterProps) {
  const { post } = props
  const t = useTranslations()
  const locale = useLocale()

  const editURL = `https://github.com/nelsonlaidev/nelsonlai.dev/blob/main/src/content/blog/${locale}/${post.slug}.mdx?plain=1`

  const formattedDate = useFormattedDate(post.modifiedTime)

  return (
    <div className='my-8 flex w-full items-center justify-between py-4 text-sm'>
      <Link href={editURL} className='text-muted-foreground transition-colors hover:text-foreground'>
        {t('blog.footer.edit-on-github')}
      </Link>
      <div className='text-muted-foreground'>{t('blog.footer.last-updated', { date: formattedDate ?? '--' })}</div>
    </div>
  )
}

export default BlogFooter
