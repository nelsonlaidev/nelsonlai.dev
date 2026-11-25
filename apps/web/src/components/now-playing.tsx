import { SiSpotify } from '@icons-pack/react-simple-icons'
import { ExternalLink } from '@repo/ui/components/external-link'
import { useQuery } from '@tanstack/react-query'
import { cn } from 'cn'

import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

type NowPlayingProps = React.ComponentProps<'div'>

export function NowPlaying(props: NowPlayingProps) {
  const { className, ...rest } = props
  const query = useQuery(
    orpc.spotify.nowPlaying.queryOptions({
      meta: { errorHandledLocally: true },
    }),
  )

  return (
    <div className={cn('flex items-start gap-2 text-sm', className)} {...rest}>
      <SiSpotify size={20} color='default' className='shrink-0' />
      <p className='min-w-0 wrap-anywhere'>
        {query.isPending && m.common_loading()}
        {query.data &&
          (query.data.isPlaying ? (
            <ExternalLink href={query.data.songUrl} rel='noreferrer' className='hover:text-foreground hover:underline'>
              {query.data.title} — {query.data.artist}
            </ExternalLink>
          ) : (
            m.nav_footer_spotify_idle()
          ))}
        {query.isError && (
          <span role='alert' className='block'>
            {m.nav_footer_spotify_error()}
          </span>
        )}
      </p>
    </div>
  )
}
