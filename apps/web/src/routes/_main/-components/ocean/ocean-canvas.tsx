import type { AvoidanceState } from './fish-motion'

import { useEffect, useRef } from 'react'

import { advanceAvoidance, approach, createAvoidance, motionLimits } from './fish-motion'

type Fish = {
  x: number
  y: number
  size: number
  speed: number
  phase: number
  school: number
  sensitivity: number
  avoidance: AvoidanceState
}
const mix = (a: number, b: number, t: number) => a + (b - a) * t

export function OceanCanvas(props: { depthBias?: number }) {
  const { depthBias = 0 } = props
  const ref = useRef<HTMLCanvasElement>(null)
  const depthRef = useRef(depthBias)
  const invalidateRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    depthRef.current = depthBias
    invalidateRef.current?.()
  }, [depthBias])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return
    const ctx = context
    const media = globalThis.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0,
      height = 0,
      frame = 0,
      time = 0,
      previous: number | null = null
    let displayedDepth: number | null = null
    const hoverMedia = globalThis.matchMedia('(any-hover: hover)')
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, strength: 0, active: false, initialized: false }
    const fish: Fish[] = Array.from({ length: 38 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      size: 7 + Math.random() * 21,
      speed: 0.009 + Math.random() * 0.012,
      phase: Math.random() * Math.PI * 2,
      school: i % 3,
      sensitivity: 0.9 + Math.random() * 0.2,
      avoidance: createAvoidance(),
    }))
    const particles = Array.from({ length: 75 }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.4 + 0.3,
      phase: Math.random() * 8,
    }))
    const resize = () => {
      width = globalThis.innerWidth
      height = globalThis.innerHeight
      const dpr = Math.min(globalThis.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      requestDraw()
    }
    const clearPointer = () => {
      pointer.active = false
    }
    const move = (event: PointerEvent) => {
      if (
        (event.target instanceof Element && event.target.closest('[aria-modal="true"]')) ||
        media.matches ||
        !hoverMedia.matches ||
        !['mouse', 'pen'].includes(event.pointerType) ||
        event.buttons !== 0 ||
        event.pressure > 0
      ) {
        clearPointer()
        return
      }
      pointer.targetX = event.clientX
      pointer.targetY = event.clientY
      // A fresh entry should not sweep an imaginary cursor across the viewport.
      if (!pointer.active) {
        pointer.x = pointer.targetX
        pointer.y = pointer.targetY
      }
      pointer.initialized = true
      pointer.active = true
    }
    const leave = (event: PointerEvent) => {
      if (event.relatedTarget === null) clearPointer()
    }
    const contact = (event: PointerEvent) => {
      if (event.pointerType === 'touch') clearPointer()
    }
    function requestDraw() {
      if (!frame && !document.hidden) frame = requestAnimationFrame(draw)
    }
    const resetClock = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      previous = null
      clearPointer()
      requestDraw()
    }

    function draw(stamp: number) {
      frame = 0
      if (document.hidden) {
        previous = null
        return
      }
      const dt = previous === null ? 0 : Math.min(Math.max((stamp - previous) / 1000, 0), 0.05)
      previous = stamp
      const still = media.matches
      if (!still) {
        time += dt
        pointer.strength = approach(pointer.strength, pointer.active ? 1 : 0, dt, motionLimits.activationTime)
        if (pointer.initialized) {
          pointer.x = approach(pointer.x, pointer.targetX, dt, motionLimits.pointerTime)
          pointer.y = approach(pointer.y, pointer.targetY, dt, motionLimits.pointerTime)
        }
      }
      const scrollDepth = Math.min(globalThis.scrollY / Math.max(document.documentElement.scrollHeight - height, 1), 1)
      const targetDepth = depthRef.current + scrollDepth * (1 - depthRef.current)
      displayedDepth = displayedDepth === null || still ? targetDepth : approach(displayedDepth, targetDepth, dt, 0.3)
      const depth = displayedDepth
      const sky = ctx.createLinearGradient(0, 0, width * 0.3, height)
      sky.addColorStop(0, `rgb(${mix(25, 3, depth)},${mix(111, 14, depth)},${mix(116, 28, depth)})`)
      sky.addColorStop(0.52, `rgb(${mix(9, 3, depth)},${mix(64, 16, depth)},${mix(78, 31, depth)})`)
      sky.addColorStop(1, `rgb(3,${mix(34, 10, depth)},${mix(49, 24, depth)})`)
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, width, height)

      // Broad refracted light, rather than a flat overlay.
      ctx.globalCompositeOperation = 'screen'
      for (let i = 0; i < 9; i++) {
        const origin = width * (0.16 + i * 0.105) + Math.sin(time * 0.15 + i) * 30
        const beam = ctx.createLinearGradient(origin, 0, origin - width * 0.3, height)
        beam.addColorStop(0, `rgba(158,224,195,${(1 - depth * 0.94) * (i % 2 ? 0.055 : 0.12)})`)
        beam.addColorStop(1, 'rgba(80,180,170,0)')
        ctx.fillStyle = beam
        ctx.beginPath()
        ctx.moveTo(origin, -40)
        ctx.lineTo(origin + 35, -40)
        ctx.lineTo(origin - width * 0.2 + 140, height)
        ctx.lineTo(origin - width * 0.45, height)
        ctx.fill()
      }
      const glow = ctx.createRadialGradient(width * 0.65, -100, 5, width * 0.65, 0, width * 0.6)
      glow.addColorStop(0, `rgba(197,243,214,${0.24 * (1 - depth)})`)
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)
      // The broken, rippling undersurface remains at the top of the shallows.
      if (depth < 0.25) {
        ctx.strokeStyle = `rgba(181,236,207,${0.14 * (1 - depth * 4)})`
        ctx.lineWidth = 1
        for (let row = 0; row < 12; row++) {
          ctx.beginPath()
          for (let x = -20; x < width + 20; x += 12) {
            const y = row * row * 0.65 + Math.sin(x * 0.014 + time * 0.3 + row) * (3 + row * 0.7)
            if (x === -20) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
      }
      ctx.globalCompositeOperation = 'source-over'
      // Parallax reef silhouettes create a sense of scale at the edges.
      for (let layer = 0; layer < 3; layer++) {
        ctx.fillStyle = `rgba(2,20,32,${0.12 + layer * 0.1})`
        ctx.beginPath()
        ctx.moveTo(0, height)
        for (let x = 0; x <= width + 20; x += 20) {
          const edge = Math.pow(Math.abs(x / width - 0.5) * 2, 4)
          const y =
            height -
            edge * height * (0.19 + layer * 0.08) +
            Math.sin(x * 0.007 + layer * 5) * 20 +
            Math.sin(x * 0.025) * 8
          ctx.lineTo(x, y)
        }
        ctx.lineTo(width, height)
        ctx.fill()
      }
      for (const p of particles) {
        const x = p.x * width + Math.sin(time * 0.09 + p.phase) * 15
        const y = (((p.y * height - time * (2 + p.radius)) % height) + height) % height
        ctx.fillStyle = `rgba(183,230,211,${0.13 + Math.sin(time * 0.3 + p.phase) * 0.07})`
        ctx.beginPath()
        ctx.arc(x, y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      }
      for (const f of fish) {
        const direction = f.school === 1 ? -1 : 1
        if (!still) f.x = (f.x + dt * f.speed * direction + 1) % 1
        let x = f.x * (width + 160) - 80
        let y = (0.26 + f.school * 0.22 + (f.y - 0.5) * 0.14) * height + Math.sin(time * 0.5 + f.phase) * 16
        if (!still)
          advanceAvoidance(
            f.avoidance,
            pointer,
            x,
            y,
            f.speed * (width + 160),
            f.sensitivity,
            Math.sin(f.phase) < 0 ? -1 : 1,
            dt,
          )
        x += f.avoidance.x
        y += f.avoidance.y
        const size = f.size * (width < 600 ? 0.7 : 1)
        ctx.save()
        ctx.translate(x, y)
        ctx.scale(direction, 1)
        ctx.rotate(f.avoidance.angle)
        ctx.fillStyle = f.school === 2 ? 'rgba(52,128,139,.36)' : 'rgba(2,34,48,.52)'
        ctx.beginPath()
        ctx.moveTo(size, 0)
        ctx.bezierCurveTo(size * 0.35, -size * 0.36, -size * 0.35, -size * 0.3, -size * 0.7, 0)
        ctx.bezierCurveTo(-size * 0.2, size * 0.28, size * 0.4, size * 0.25, size, 0)
        ctx.fill()
        const tail = Math.sin(time * 5 + f.phase) * size * 0.1
        ctx.beginPath()
        ctx.moveTo(-size * 0.55, 0)
        ctx.lineTo(-size * 1.03, -size * 0.35 + tail)
        ctx.lineTo(-size * 0.96, size * 0.33 + tail)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = 'rgba(141,205,194,.13)'
        ctx.beginPath()
        ctx.moveTo(-size * 0.5, 0)
        ctx.lineTo(size * 0.7, -size * 0.04)
        ctx.stroke()
        ctx.restore()
      }
      // A quiet, bioluminescent visitor in the deep chapters.
      if (depth > 0.35) {
        const x = width * 0.82 + Math.sin(time * 0.12) * 28,
          y = height * 0.35 + Math.sin(time * 0.25) * 18
        ctx.save()
        ctx.translate(x, y)
        ctx.globalAlpha = Math.min((depth - 0.35) * 3, 0.65)
        const light = ctx.createRadialGradient(0, 0, 1, 0, 0, 85)
        light.addColorStop(0, 'rgba(104,197,207,.1)')
        light.addColorStop(1, 'transparent')
        ctx.fillStyle = light
        ctx.fillRect(-85, -85, 170, 170)
        ctx.strokeStyle = 'rgba(141,222,219,.35)'
        ctx.fillStyle = 'rgba(120,205,209,.07)'
        ctx.beginPath()
        ctx.ellipse(0, 0, 27, 22 + Math.sin(time) * 2, Math.PI, 0, Math.PI)
        ctx.bezierCurveTo(10, 5, -12, 5, -27, 0)
        ctx.fill()
        ctx.stroke()
        for (let n = 0; n < 7; n++) {
          ctx.beginPath()
          const tx = (n - 3) * 6
          ctx.moveTo(tx, 2)
          ctx.bezierCurveTo(
            tx + Math.sin(time + n) * 15,
            28,
            tx - 13,
            42,
            tx + Math.sin(time * 0.6 + n) * 14,
            74 + n * 3,
          )
          ctx.stroke()
        }
        ctx.restore()
      }
      if (!still) requestDraw()
    }
    invalidateRef.current = requestDraw
    resize()
    media.addEventListener('change', resetClock)
    document.addEventListener('visibilitychange', resetClock)
    globalThis.addEventListener('blur', clearPointer)
    globalThis.addEventListener('scroll', requestDraw, { passive: true })
    globalThis.addEventListener('pointerdown', contact)
    globalThis.addEventListener('resize', resize)
    globalThis.addEventListener('pointermove', move)
    globalThis.addEventListener('pointerout', leave)
    return () => {
      cancelAnimationFrame(frame)
      invalidateRef.current = null
      media.removeEventListener('change', resetClock)
      document.removeEventListener('visibilitychange', resetClock)
      globalThis.removeEventListener('blur', clearPointer)
      globalThis.removeEventListener('scroll', requestDraw)
      globalThis.removeEventListener('pointerdown', contact)
      globalThis.removeEventListener('resize', resize)
      globalThis.removeEventListener('pointermove', move)
      globalThis.removeEventListener('pointerout', leave)
    }
  }, [])

  return <canvas ref={ref} className='pointer-events-none fixed inset-0 -z-20 size-full' aria-hidden='true' />
}
