import { ExternalLink } from '@repo/ui/components/external-link'
import { useQuery } from '@tanstack/react-query'
import { StarIcon } from 'lucide-react'

import { orpc } from '@/lib/orpc-client'
import { SITE } from '@/lib/site'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

export function GitHubStarButton() {
  const { data, isError } = useQuery(
    orpc.github.repositoryStats.queryOptions({ staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }),
  )
  const count = data ? new Intl.NumberFormat(getLocale()).format(data.stars) : '--'

  return (
    <ExternalLink
      href={SITE.repository}
      className='flex shrink-0 items-center overflow-hidden rounded-4xl border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
    >
      <span className='flex h-8 items-center gap-2 bg-muted pr-2 pl-3 font-medium'>
        <StarIcon className='size-4' aria-hidden='true' />
        {m.layout_footer_github_star()}
        <span className='sr-only'>GitHub</span>
      </span>
      <span className='flex h-8 items-center border-l bg-background pr-3 pl-2'>
        {!data && isError ? m.common_error() : count}
      </span>
    </ExternalLink>
  )
}
