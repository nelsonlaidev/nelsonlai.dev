// All motion is in CSS pixels/seconds. A bounded spring offsets the existing
// cruising path; it never moves a fish directly to a cursor-derived position.
export type AvoidanceState = {
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  side: number
  engaged: boolean
}
export type HoverState = { x: number; y: number; strength: number }
export const motionLimits = {
  radius: 120,
  offset: 30,
  speed: 35,
  acceleration: 120,
  angle: (22 * Math.PI) / 180,
  turnRate: (45 * Math.PI) / 180,
  pointerTime: 0.11,
  activationTime: 0.22,
} as const
export const createAvoidance = (): AvoidanceState => ({ x: 0, y: 0, vx: 0, vy: 0, angle: 0, side: 1, engaged: false })
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
export const approach = (current: number, target: number, dt: number, seconds: number) =>
  target + (current - target) * Math.exp(-dt / seconds)

export function advanceAvoidance(
  state: AvoidanceState,
  hover: HoverState,
  baseX: number,
  baseY: number,
  cruiseSpeed: number,
  sensitivity: number,
  preferredSide: number,
  dt: number,
) {
  const dx = baseX - hover.x,
    dy = baseY - hover.y
  const distance = Math.hypot(dx, dy),
    radius = motionLimits.radius * sensitivity
  if (!state.engaged && hover.strength > 0.02 && distance < radius) {
    state.engaged = true
    state.side = Math.abs(dy) < 6 ? preferredSide : Math.sign(dy)
  } else if (distance > radius + 20 || hover.strength < 0.01) {
    state.engaged = false
  }
  // Hold the chosen passing side throughout an encounter. Crossing the fish's
  // centre cannot flip it from one side to the other in a single frame.
  const proximity = clamp(1 - distance / radius, 0, 1)
  const weight = proximity * proximity * (3 - 2 * proximity) * hover.strength
  const targetX = clamp(dx / radius, -1, 1) * motionLimits.offset * 0.2 * weight
  const targetY = state.side * motionLimits.offset * sensitivity * weight
  const omega = weight > 0.01 ? 7 : 4.5
  // Small bounded substeps keep the spring consistent at 30/60/144Hz.
  const steps = Math.max(1, Math.ceil(dt / (1 / 120))),
    step = dt / steps
  for (let i = 0; i < steps; i++) {
    let ax = omega * omega * (targetX - state.x) - 2 * omega * state.vx
    let ay = omega * omega * (targetY - state.y) - 2 * omega * state.vy
    const acceleration = Math.hypot(ax, ay)
    if (acceleration > motionLimits.acceleration) {
      ax *= motionLimits.acceleration / acceleration
      ay *= motionLimits.acceleration / acceleration
    }
    let vx = state.vx + ax * step,
      vy = state.vy + ay * step
    const speed = Math.hypot(vx, vy)
    if (speed > motionLimits.speed) {
      vx *= motionLimits.speed / speed
      vy *= motionLimits.speed / speed
    }
    state.vx = vx
    state.vy = vy
    state.x += vx * step
    state.y += vy * step
    const targetAngle = clamp(Math.atan2(vy, Math.max(cruiseSpeed, 10)), -motionLimits.angle, motionLimits.angle)
    state.angle += clamp(targetAngle - state.angle, -motionLimits.turnRate * step, motionLimits.turnRate * step)
  }
}
