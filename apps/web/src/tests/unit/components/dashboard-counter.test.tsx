import { render } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { Counter } from '@/routes/_main/-components/dashboard/counter'

const fixture = vi.hoisted(() => ({ animate: vi.fn<() => { stop: () => void }>(() => ({ stop: () => {} })) }))
vi.mock('motion/react', () => ({ animate: fixture.animate, useReducedMotion: () => true, useInView: () => true }))

describe('Dashboard counter reduced motion', () => {
  test('renders actual localized values immediately without animation', () => {
    const view = render(<Counter value={12_345} />)
    expect(view.container.querySelector('[aria-hidden]')).toHaveTextContent('12,345')
    expect(view.container.querySelector('.sr-only')).toHaveTextContent('12,345')
    expect(fixture.animate).not.toHaveBeenCalled()
    view.rerender(<Counter value={0} />)
    expect(view.container.querySelector('[aria-hidden]')).toHaveTextContent('0')
    expect(fixture.animate).not.toHaveBeenCalled()
  })
})
