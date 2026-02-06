'use client'

import type { TOC } from '@/mdx-plugins'

import { AlignLeftIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useRouter } from '@/i18n/routing'

type MobileTableOfContentsProps = {
  toc: TOC[]
}

function MobileTableOfContents(props: MobileTableOfContentsProps) {
  const { toc } = props
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const t = useTranslations()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className='gap-2'
        render={
          <Button variant='secondary' className='fixed right-2 bottom-2 z-50 lg:hidden'>
            <AlignLeftIcon data-icon='inline-start' /> {t('blog.on-this-page')}
          </Button>
        }
      />
      <PopoverContent align='end' side='top' className='px-0 py-2'>
        {toc.map((item) => {
          const { title, url, depth } = item

          return (
            <Link
              key={url}
              href={`#${url}`}
              className='block py-2.5 pr-2.5 text-sm/tight text-muted-foreground transition-colors hover:text-foreground'
              style={{
                paddingLeft: (depth - 1) * 16,
              }}
              onClick={() => {
                router.push(`#${url}`)
                setIsOpen(false)
              }}
            >
              {title}
            </Link>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}

export default MobileTableOfContents
