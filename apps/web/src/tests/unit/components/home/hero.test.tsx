import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { m } from '@/paraglide/messages'
import { Hero } from '@/routes/_main/-components/home/hero'

describe('<Hero />', () => {
  test('renders the ocean introduction and links to the projects chapter', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(m.ocean_hero_title())
    expect(screen.getByText(m.ocean_coordinate())).toBeInTheDocument()
    expect(screen.getByRole('link', { name: m.ocean_dive() })).toHaveAttribute('href', '#discoveries')
  })
})
