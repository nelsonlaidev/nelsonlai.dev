import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { m } from '@/paraglide/messages'
import { StatCards } from '@/routes/_main/-components/dashboard/stats'

type CounterProps = {
  value: number
}

vi.mock('@/lib/orpc-client', () => ({ orpc: {} }))

vi.mock('@/routes/_main/-components/dashboard/counter', () => ({
  Counter: (props: CounterProps) => <>{new Intl.NumberFormat('en').format(props.value)}</>,
}))

const metrics = [
  { title: 'Coding Hours', field: 'hours', suffix: 'hrs' },
  { title: 'YouTube Subscribers', field: 'subscribers' },
  { title: 'Views', field: 'views' },
  { title: 'Followers', field: 'followers' },
  { title: 'Stars', field: 'stars' },
  { title: 'Likes', field: 'likes' },
] as const

describe('Dashboard metric states', () => {
  test('keeps field meanings and hour units, including real zero values', () => {
    render(
      <StatCards
        stats={[...metrics]}
        values={{ hours: 12_345, subscribers: 7, views: 0, followers: 11, stars: 13, likes: 17 }}
      />,
    )

    expect(screen.getByText('12,345')).toBeInTheDocument()
    expect(screen.getByText('hrs')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    for (const value of ['7', '11', '13', '17']) expect(screen.getByText(value)).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  test('announces loading without inventing a number', () => {
    const view = render(<StatCards stats={[metrics[0]]} />)

    expect(screen.getByRole('status')).toHaveTextContent(m.common_aria_labels_loading())
    expect(view.container.querySelector('dl')).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  test('shows unavailable on service error or an absent field', () => {
    const view = render(<StatCards stats={[metrics[0]]} isError />)

    expect(screen.getByText(m.dashboard_unavailable())).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    view.rerender(<StatCards stats={[metrics[0]]} values={{ views: 100 }} />)
    expect(screen.getByText(m.dashboard_unavailable())).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByText('100')).not.toBeInTheDocument()
  })

  test('rejects invalid numeric output', () => {
    render(<StatCards stats={[metrics[0]]} values={{ hours: Number.NaN }} />)

    expect(screen.getByText(m.dashboard_unavailable())).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByText('NaN')).not.toBeInTheDocument()
  })
})
