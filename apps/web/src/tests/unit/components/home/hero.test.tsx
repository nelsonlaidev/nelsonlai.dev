import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { m } from '@/paraglide/messages'
import { Hero } from '@/routes/_main/-components/home/hero'

describe('<Hero />', () => {
  test('renders the current introduction and location', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(m.homepage_hero_intro())
    expect(screen.getByText(m.homepage_hero_location())).toBeInTheDocument()
  })
})
