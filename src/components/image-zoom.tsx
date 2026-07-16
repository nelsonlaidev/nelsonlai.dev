'use client'

import '@/styles/image-zoom.css'
import 'react-medium-image-zoom/dist/styles.css'

import Zoom from 'react-medium-image-zoom'

type ImageZoomProps = React.ComponentProps<typeof Zoom> & {
  children: React.ReactNode
}

export function ImageZoom(props: ImageZoomProps) {
  const { children, ...rest } = props

  return (
    <Zoom zoomMargin={40} {...rest}>
      {children}
    </Zoom>
  )
}
