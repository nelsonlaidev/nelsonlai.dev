import { cn } from 'cn'

type VideoProps = React.ComponentProps<'video'> & {
  src: string
  width: number
  height: number
}

export function Video(props: VideoProps) {
  const { src, width, height, controls = true, className, ...rest } = props

  return (
    <div className='relative aspect-video'>
      <video
        className={cn('my-4 rounded-lg', className)}
        preload='metadata'
        loop
        muted
        src={src}
        controls={controls}
        width={width}
        height={height}
        {...rest}
      />
    </div>
  )
}
