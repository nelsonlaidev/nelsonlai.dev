'use client'

import '@/styles/image-zoom.css'
import 'react-medium-image-zoom/dist/styles.css'

import Zoom from 'react-medium-image-zoom'

type ImageZoomProps = {
  children: React.ReactNode
} & React.ComponentProps<typeof Zoom>

function ImageZoom(props: ImageZoomProps) {
  const { children, ...rest } = props

  return (
    <Zoom zoomMargin={40} {...rest}>
      {children}
    </Zoom>
  )
}

export default ImageZoom
