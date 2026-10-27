import type { PostSummary } from './types'

import { InputGroup, InputGroupAddon, InputGroupInput } from '@repo/ui/components/input-group'
import { SearchIcon } from 'lucide-react'
import { useState } from 'react'

import { PostCard } from '@/components/post-card'
import { m } from '@/paraglide/messages'

import { usePostStats } from './use-post-stats'

type FilteredPostsProps = {
  posts: PostSummary[]
}

export function FilteredPosts(props: FilteredPostsProps) {
  const { posts } = props
  const [searchValue, setSearchValue] = useState('')
  const statsQuery = usePostStats(posts.map((post) => post.slug))
  const statsBySlug = new Map(statsQuery.data?.map((stats) => [stats.slug, stats]))
  const query = searchValue.toLowerCase()
  const filteredPosts = posts.filter((post) => post.title.toLowerCase().includes(query))

  return (
    <>
      <InputGroup className='mb-8'>
        <InputGroupInput
          type='text'
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value)
          }}
          placeholder={m.components_filtered_posts_placeholder()}
          aria-label={m.components_filtered_posts_placeholder()}
          id='search'
        />
        <InputGroupAddon>
          <SearchIcon className='text-muted-foreground' aria-hidden='true' />
        </InputGroupAddon>
      </InputGroup>
      {filteredPosts.length === 0 && (
        <output className='my-24 block text-center text-xl'>{m.components_filtered_posts_no_posts_found()}</output>
      )}
      <div className='grid gap-4 md:grid-cols-2'>
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} post={post} stats={statsBySlug.get(post.slug)} isStatsError={statsQuery.isError} />
        ))}
      </div>
    </>
  )
}
