import { createElement } from 'react'
import { preinitModule } from 'react-dom'

import oceanModuleUrl from './ocean-element.ts?worker&url'

type OceanCanvasProps = {
  depthBias?: number
}

export function OceanCanvas(props: OceanCanvasProps) {
  const { depthBias = 0 } = props

  // Request the standalone browser bundle as soon as the server renders the ocean.
  preinitModule(oceanModuleUrl, { as: 'script' })

  return createElement('ocean-canvas', {
    'aria-hidden': true,
    class: 'pointer-events-none fixed inset-0 -z-20',
    'data-depth': depthBias,
  })
}
