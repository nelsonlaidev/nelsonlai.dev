import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
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

describe('native image contract', () => {
  test('forwards object refs and composes caller error handlers', () => {
    const ref = createRef<HTMLImageElement>()
    const onError = vi.fn<React.ReactEventHandler<HTMLImageElement>>()
    const view = render(<ProductImage ref={ref} onError={onError} src='/broken.png' alt='Equipment' />)
    const image = view.container.querySelector('img')
    expect(ref.current).toBe(image)
    if (!image) throw new Error('Expected image')
    fireEvent.error(image)
    expect(onError).toHaveBeenCalledOnce()
    expect(ref.current).toBeNull()
    expect(screen.getByRole('img', { name: 'Equipment' }).tagName).toBe('SPAN')
  })

  test('honors React 19 callback ref cleanup', () => {
    const cleanup = vi.fn<() => void>()
    const ref = vi.fn<React.RefCallback<HTMLImageElement>>(() => cleanup)
    const view = render(<ProductImage ref={ref} src='/valid.png' alt='Equipment' />)
    expect(ref).toHaveBeenCalledExactlyOnceWith(view.container.querySelector('img'))
    view.unmount()
    expect(cleanup).toHaveBeenCalledOnce()
  })

  test('detaches and replaces callback refs while preserving load handlers and native dimensions', () => {
    const first = vi.fn<(image: HTMLImageElement | null) => void>()
    const second = vi.fn<(image: HTMLImageElement | null) => void>()
    const onLoad = vi.fn<React.ReactEventHandler<HTMLImageElement>>()
    const view = render(
      <ProductImage ref={first} onLoad={onLoad} src='/image.png' alt='Equipment' width={240} height={135} />,
    )
    const image = screen.getByRole('img')
    expect(first).toHaveBeenCalledExactlyOnceWith(image)
    fireEvent.load(image)
    expect(onLoad).toHaveBeenCalledOnce()
    expect(image).toHaveAttribute('width', '240')
    expect(image).toHaveAttribute('height', '135')
    view.rerender(<ProductImage ref={second} src='/image.png' alt='Equipment' />)
    expect(first).toHaveBeenLastCalledWith(null)
    expect(second).toHaveBeenCalledExactlyOnceWith(image)
    view.unmount()
    expect(second).toHaveBeenLastCalledWith(null)
  })

  test('recovers after a failed source changes and can load the original source again', () => {
    const view = render(<ProductImage src='/broken.png' alt='Equipment' />)
    fireEvent.error(screen.getByRole('img'))
    view.rerender(<ProductImage src='/valid.png' alt='Equipment' />)
    expect(screen.getByRole('img').tagName).toBe('IMG')
    expect(screen.getByRole('img')).toHaveAttribute('src', '/valid.png')
    view.rerender(<ProductImage src='/broken.png' alt='Equipment' />)
    expect(screen.getByRole('img').tagName).toBe('IMG')
  })

  test('retries when only the responsive source changes', () => {
    const view = render(<ProductImage src='/image.png' srcSet='/broken.png 2x' alt='' />)
    const image = view.container.querySelector('img')
    if (!image) throw new Error('Expected image')
    fireEvent.error(image)
    view.rerender(<ProductImage src='/image.png' srcSet='/valid.png 2x' alt='' />)
    expect(view.container.querySelector('img')).toHaveAttribute('srcset', '/valid.png 2x')
  })
})
