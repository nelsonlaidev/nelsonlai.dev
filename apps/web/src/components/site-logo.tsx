import { cn } from 'cn'

type SiteLogoProps = {
  large?: boolean
}

export function SiteLogo(props: SiteLogoProps) {
  const { large } = props

  return (
    <span
      className={cn(
        'inline-flex items-center tracking-tight',
        large ? 'gap-3 text-2xl' : 'gap-2 text-base md:gap-3.5 md:text-lg',
      )}
    >
      <img
        src='/images/seafold.svg'
        width={38}
        height={38}
        alt=''
        className={cn('shrink-0 object-contain', large ? 'size-9' : 'size-8 md:size-10')}
      />
      <span>Seafold</span>
    </span>
  )
}
