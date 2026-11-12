import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { m } from '@/paraglide/messages'
import { Hero } from '@/routes/_main/-components/home/hero'

describe('<Hero />', () => {
  test('renders the ocean introduction and links to the projects chapter', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(m.home_hero_title())
    expect(screen.getByText(m.home_hero_description(), { normalizer: (text) => text })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: m.home_hero_dive() })).toHaveAttribute('href', '#projects')
  })
})
