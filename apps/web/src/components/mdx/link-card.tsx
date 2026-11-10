import { BlurImage } from '@repo/ui/components/blur-image'
import { ExternalLink } from '@repo/ui/components/external-link'
import { ExternalLinkIcon } from 'lucide-react'

type LinkCardProps = {
  href: string
  hostname: string
  title: string
}

export function LinkCard(props: LinkCardProps) {
  const { href, hostname, title } = props

  return (
    <div className='not-prose flex justify-center'>
      <ExternalLink
        href={href}
        className='my-8 flex min-w-0 items-center justify-center gap-4 rounded-xl border p-4 transition-colors ease-linear hover:bg-accent motion-reduce:transition-none'
      >
        <BlurImage
          src={`/images/website-icons/${hostname}.png`}
          className='shrink-0 rounded-lg'
          width={48}
          height={48}
          alt=''
        />
        <div className='min-w-0'>
          <div className='font-semibold'>{title}</div>
          <div className='text-sm wrap-break-word text-muted-foreground'>{href}</div>
        </div>
        <ExternalLinkIcon className='size-5 shrink-0' aria-hidden='true' />
      </ExternalLink>
    </div>
  )
}
