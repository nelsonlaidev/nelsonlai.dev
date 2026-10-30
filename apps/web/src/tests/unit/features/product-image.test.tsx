import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { ProductImage } from '@/features/profile/product-image'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('equipment images', () => {
  test('keeps a useful accessible fallback when an SSR image failed before hydration', () => {
    vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true)
    vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(0)
    render(<ProductImage src='/missing-laptop.png' alt='MacBook Pro 16-inch' />)
    const fallback = screen.getByRole('img', { name: 'MacBook Pro 16-inch' })
    expect(fallback.tagName).toBe('SPAN')
    expect(fallback).toHaveClass('aspect-video')
  })

  test('keeps the inventory image dimensions after a client image error', () => {
    const { container } = render(<ProductImage src='/missing.png' alt='' />)
    const image = container.querySelector('img')
    expect(image).not.toBeNull()
    if (image) fireEvent.error(image)
    expect(container.querySelector('span[aria-hidden="true"]')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('img')).toBeNull()
  })
})
