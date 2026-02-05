import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn } from '@/utils/cn'

type VideoProps = {
  src: string
  width: number
  height: number
} & React.ComponentProps<'video'>

function Video(props: VideoProps) {
  const { src, width, height, controls = true, className, ...rest } = props

  return (
    <AspectRatio ratio={16 / 9}>
      <video
        className={cn('my-4 rounded-lg', className)}
        loop
        muted
        src={src}
        controls={controls}
        width={width}
        height={height}
        {...rest}
      />
    </AspectRatio>
  )
}

export default Video
