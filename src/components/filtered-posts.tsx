'use client'

import type { Post } from 'content-collections'

import { SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import PostCards from './post-cards'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'

type FilteredPostsProps = {
  posts: Post[]
}

function FilteredPosts(props: FilteredPostsProps) {
  const { posts } = props
  const [searchValue, setSearchValue] = useState('')
  const t = useTranslations()

  const filteredPosts = posts.filter((post) => post.title.toLowerCase().includes(searchValue.toLowerCase()))

  return (
    <>
      <InputGroup className='mb-8'>
        <InputGroupInput
          type='text'
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
          }}
          placeholder={t('components.filtered-posts.placeholder')}
          aria-label={t('components.filtered-posts.placeholder')}
          className='w-full pl-12'
          id='search'
        />
        <InputGroupAddon>
          <SearchIcon className='text-muted-foreground' />
        </InputGroupAddon>
      </InputGroup>
      {filteredPosts.length === 0 && (
        <div className='my-24 text-center text-xl'>{t('components.filtered-posts.no-posts-found')}</div>
      )}
      <PostCards posts={filteredPosts} />
    </>
  )
}

export default FilteredPosts
