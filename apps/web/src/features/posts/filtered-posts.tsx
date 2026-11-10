import type { PostSummary } from './types'

import { Button } from '@repo/ui/components/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@repo/ui/components/input-group'
import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, SearchIcon } from 'lucide-react'
import { useState } from 'react'

import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

type FilteredPostsProps = {
  posts: PostSummary[]
}

export function FilteredPosts(props: FilteredPostsProps) {
  const { posts } = props
  const [searchValue, setSearchValue] = useState('')
  const query = searchValue.toLocaleLowerCase().trim()
  const filteredPosts = posts.filter((post) => `${post.title} ${post.description}`.toLocaleLowerCase().includes(query))
  const date = new Intl.DateTimeFormat(getLocale(), { month: 'short', day: 'numeric', timeZone: 'UTC' })

  return (
    <>
      <div className='mb-5 flex flex-wrap items-center gap-x-4 gap-y-2'>
        <InputGroup className='sm:max-w-sm'>
          <InputGroupInput
            type='search'
            id='search'
            aria-label={m.blog_search_placeholder()}
            placeholder={m.blog_search_placeholder()}
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value)
            }}
          />
          <InputGroupAddon>
            <SearchIcon aria-hidden='true' />
          </InputGroupAddon>
        </InputGroup>
        <output className='text-sm text-muted-foreground empty:hidden'>
          {query && m.blog_count({ count: filteredPosts.length })}
        </output>
      </div>
      {filteredPosts.map((post) => (
        <article key={post.slug} className='border-b first-of-type:border-t'>
          <Link
            to='/blog/$slug'
            params={{ slug: post.slug }}
            className='group/row grid grid-cols-[1fr_--spacing(5)] items-center gap-3.5 py-7 sm:grid-cols-[--spacing(24)_1fr_--spacing(9)] sm:gap-9 sm:py-11'
          >
            <div className='col-span-full flex items-center gap-2.5 self-start text-muted-foreground sm:col-span-1 sm:flex-col sm:items-start sm:pt-1'>
              <span className='text-sm font-light tracking-tighter sm:text-3xl'>{post.publishedAt.slice(0, 4)}</span>
              <time dateTime={post.publishedAt} className='text-sm/normal text-muted-foreground/80'>
                {date.format(new Date(post.publishedAt))}
              </time>
            </div>
            <div>
              <h2 className='text-2xl tracking-tighter sm:text-3xl xl:text-4xl'>{post.title}</h2>
              <p className='mt-4 max-w-2xl text-base/relaxed text-muted-foreground'>{post.description}</p>
            </div>
            <ArrowRightIcon
              aria-hidden='true'
              className='transition-transform duration-300 ease-linear motion-safe:group-hover/row:translate-x-2 motion-safe:group-focus-visible/row:translate-x-2 motion-reduce:transition-none'
            />
          </Link>
        </article>
      ))}
      {filteredPosts.length === 0 && (
        <div className='py-10 text-center sm:py-16'>
          <h2 className='mb-3 text-2xl tracking-tighter sm:text-3xl'>{m.blog_search_no_posts_found()}</h2>
          <Button
            variant='ghost'
            type='button'
            onClick={() => {
              setSearchValue('')
            }}
          >
            {m.blog_reset()}
            <ArrowRightIcon
              aria-hidden='true'
              data-icon='inline-end'
              className='motion-safe:transition-transform motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-visible/button:translate-x-1'
            />
          </Button>
        </div>
      )}
    </>
  )
}
