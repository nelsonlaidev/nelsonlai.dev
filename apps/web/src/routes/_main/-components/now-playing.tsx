import { SiSpotify } from '@icons-pack/react-simple-icons'
import { ExternalLink } from '@repo/ui/components/external-link'
import { useQuery } from '@tanstack/react-query'
import { cn } from 'cn'

import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

type NowPlayingProps = React.ComponentProps<'div'>

export function NowPlaying(props: NowPlayingProps) {
  const { className, ...rest } = props
  const { data, isError } = useQuery(
    orpc.spotify.nowPlaying.queryOptions({
      staleTime: 30_000,
      refetchInterval: 30_000,
      refetchOnWindowFocus: false,
    }),
  )

  let content: React.ReactNode = m.common_loading()

  if (data?.isPlaying) {
    content = (
      <ExternalLink href={data.songUrl} className='hover:underline'>
        <span className='sr-only'>Spotify: </span>
        {data.title} - {data.artist}
      </ExternalLink>
    )
  } else if (data) {
    content = m.layout_now_playing_not_listening()
  } else if (isError) {
    content = m.error_now_playing_error()
  }

  return (
    <div className={cn('flex items-center gap-4 text-sm', className)} {...rest}>
      <SiSpotify className='size-5 shrink-0 text-[#1ed760]' aria-hidden='true' />
      {/* Use a status region to announce Spotify playback updates. */}
      {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
      <span role='status' className='min-w-0 flex-1 wrap-anywhere'>
        {content}
      </span>
    </div>
  )
}
