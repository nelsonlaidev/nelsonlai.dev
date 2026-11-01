import type { ArticleTopic } from './presentation'
import type { PostSummary } from './types'

import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, SearchIcon } from 'lucide-react'
import { useState } from 'react'

import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

import { articleTopic, articleTopicLabel } from './presentation'

type FilteredPostsProps = {
  posts: PostSummary[]
}

export function FilteredPosts(props: FilteredPostsProps) {
  const { posts } = props
  const [searchValue, setSearchValue] = useState('')
  const [topic, setTopic] = useState<ArticleTopic | 'all'>('all')
  const query = searchValue.toLocaleLowerCase().trim()
  const filteredPosts = posts.filter(
    (post) =>
      (topic === 'all' || articleTopic(post.slug) === topic) &&
      `${post.title} ${post.description}`.toLocaleLowerCase().includes(query),
  )
  const date = new Intl.DateTimeFormat(getLocale(), { month: 'short', day: 'numeric', timeZone: 'UTC' })

  return (
    <>
      <div className='flex flex-wrap items-center justify-between gap-5 max-[601px]:flex-col max-[601px]:items-stretch max-[601px]:gap-5.5'>
        <fieldset aria-label={m.blog_all_articles()} className='flex flex-wrap gap-1.75 max-[601px]:gap-0.75'>
          {(['all', 'testing', 'design', 'engineering'] as const).map((item) => (
            <button
              key={item}
              type='button'
              aria-pressed={topic === item}
              onClick={() => {
                setTopic(item)
              }}
              className='min-h-11 cursor-pointer rounded-md border border-transparent px-3.75 py-2.25 text-sm/normal text-[#91b2aa] hover:text-[#e3eddf] aria-pressed:border-[#b3d4c53b] aria-pressed:bg-[#b3d4c50a] aria-pressed:text-[#e3eddf] max-[601px]:px-2.75 max-[601px]:py-2'
            >
              {item === 'all' ? m.blog_everything() : articleTopicLabel(item)}
            </button>
          ))}
        </fieldset>
        <label className='flex items-center gap-3 rounded-md border border-input px-2.5 py-0 shadow-xs focus-within:border-ring focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--ring)_50%,transparent)]'>
          <SearchIcon aria-hidden='true' className='size-4 text-[#93b2a7]' />
          <span className='sr-only'>{m.blog_search_placeholder()}</span>
          <input
            type='search'
            id='search'
            placeholder={m.blog_search_placeholder()}
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value)
            }}
            className='min-h-11 w-50 min-w-0 border-0 bg-transparent px-0 py-1.25 text-base/normal text-[#e2ebde] placeholder:text-[#83a79e] focus-visible:outline-offset-4 focus-visible:outline-none max-[601px]:w-full'
          />
        </label>
      </div>
      <p aria-live='polite' className='mx-0 mt-7 mb-5 text-sm/normal text-[#8cafaa]'>
        {filteredPosts.length === 1 ? m.blog_one() : m.blog_count({ count: filteredPosts.length })}
      </p>
      <div className='border-t border-t-border'>
        {filteredPosts.map((post) => (
          <article key={post.slug} className='border-b border-b-border'>
            <Link
              to='/blog/$slug'
              params={{ slug: post.slug }}
              className='group/row grid grid-cols-[95px_1fr_35px] items-center gap-8.75 px-0 py-10.5 max-[601px]:grid-cols-[1fr_20px] max-[601px]:gap-3.5 max-[601px]:px-0 max-[601px]:py-6.75'
            >
              <div className='flex flex-col gap-2.25 self-start pt-0.75 text-[#a8c4b7] max-[601px]:col-span-full max-[601px]:flex-row max-[601px]:items-center max-[601px]:gap-2.5 max-[601px]:p-0'>
                <span className='text-[29px] leading-normal font-[350] tracking-[-0.04em] max-[601px]:text-sm'>
                  {post.publishedAt.slice(0, 4)}
                </span>
                <time dateTime={post.publishedAt} className='text-sm/normal text-[#8cafaa]'>
                  {date.format(new Date(post.publishedAt))}
                </time>
              </div>
              <div>
                <span className='mb-3.25 block text-xs leading-[normal] tracking-[normal] text-[#b4cec4] max-[601px]:mb-2.75'>
                  {articleTopicLabel(articleTopic(post.slug))}
                </span>
                <h2 className='text-[clamp(23px,2.6vw,36px)] leading-[1.3] font-[410] tracking-tighter max-[601px]:text-2xl'>
                  {post.title}
                </h2>
                <p className='mt-3.75 max-w-162.5 text-base/[1.65] text-[#9dbbb1]'>{post.description}</p>
              </div>
              <ArrowRightIcon
                aria-hidden='true'
                className='transition-transform duration-300 ease-linear group-hover/row:transform-[translateX(7px)]'
              />
            </Link>
          </article>
        ))}
      </div>
      {filteredPosts.length === 0 && (
        <div className='border border-border px-5 py-20 text-center'>
          <h2 className='text-3xl/normal font-[410] tracking-tighter'>{m.blog_search_no_posts_found()}</h2>
          <button
            type='button'
            onClick={() => {
              setSearchValue('')
              setTopic('all')
            }}
            className='mt-7 inline-flex min-h-11 cursor-pointer items-center gap-7 rounded-md border border-[#a7cabb65] px-5.75 py-3.5'
          >
            {m.blog_reset()} <ArrowRightIcon aria-hidden='true' className='w-4.5' />
          </button>
        </div>
      )}
      <p className='mt-9.5 text-sm leading-[1.9] text-[#8cafaa]'>
        {m.blog_archive()}{' '}
        <Link to='/about' className='ml-1.25 inline-flex items-center gap-1.75 text-[#bad2c4]'>
          {m.blog_author()} <ArrowRightIcon aria-hidden='true' className='w-4.5' />
        </Link>
      </p>
    </>
  )
}
