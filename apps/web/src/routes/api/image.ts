import { createHash } from 'node:crypto'

import { IMAGE_WIDTHS } from '@repo/utils'
import { createFileRoute } from '@tanstack/react-router'
import { useStorage as getStorage } from 'nitro/storage'
import sharp from 'sharp'

// Keep a bounded cache of transformed variants, independently of HTTP caching.
const variants = new Map<string, Promise<{ data: Buffer; etag: string }>>()

export const Route = createFileRoute('/api/image')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const src = url.searchParams.get('src') ?? ''
        const width = Number(url.searchParams.get('w'))
        if (
          !src.startsWith('/images/') ||
          !/^\/images\/[\w./-]+\.(?:png|jpe?g|webp)$/i.test(src) ||
          src.split('/').includes('..') ||
          !IMAGE_WIDTHS.some((size) => size === width)
        ) {
          return new Response('Invalid image parameters', { status: 400 })
        }
        const key = `${src}:${width}`
        let variant = variants.get(key)
        if (!variant) {
          const input = await getStorage('assets:images').getItemRaw<Buffer>(src.slice('/images/'.length))
          if (!input) return new Response('Image not found', { status: 404 })
          if (variants.size >= 64) variants.delete(variants.keys().next().value ?? '')
          variant = (async () => {
            try {
              const data = await sharp(input, { limitInputPixels: 40_000_000 })
                .rotate()
                .resize({ width, withoutEnlargement: true })
                .webp({ quality: 100 })
                .timeout({ seconds: 10 })
                .toBuffer()
              return { data, etag: `"${createHash('sha256').update(data).digest('base64url')}"` }
            } catch (error) {
              variants.delete(key)
              throw error
            }
          })()
          variants.set(key, variant)
        }
        try {
          const { data, etag } = await variant
          const headers = {
            'Content-Type': 'image/webp',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
            ETag: etag,
          }
          if (request.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers })
          return new Response(new Uint8Array(data), { headers })
        } catch (error) {
          console.warn('[Images] Transformation failed', error)
          return new Response('Unable to process image', { status: 422 })
        }
      },
    },
  },
})
