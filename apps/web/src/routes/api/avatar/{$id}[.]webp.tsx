// Based on vercel/avatar (MIT License)
// Copyright (c) Vercel
// Source: https://github.com/vercel/avatar/blob/410bc1e438ef26a7456b037bbdd44d5aec49031a/pages/api/avatar/%5Bname%5D.tsx
//
// Modified by: Nelson Lai
import { createFileRoute } from '@tanstack/react-router'
import { googleFonts } from 'takumi-js/helpers'
import ImageResponse from 'takumi-js/response'
import color from 'tinycolor2'
import * as z from 'zod'

export const Route = createFileRoute('/api/avatar/{$id}.webp')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const parsedSize = z.coerce
          .number()
          .int()
          .min(1)
          .max(1024)
          .safeParse(new URL(request.url).searchParams.get('size') ?? 120)
        const parsedText = z
          .string()
          .max(2)
          .safeParse(new URL(request.url).searchParams.get('text') ?? '')

        if (!parsedSize.success) {
          return new Response('Invalid size', { status: 400 })
        }

        if (!parsedText.success) {
          return new Response('Invalid text', { status: 400 })
        }

        const text = parsedText.data
        const size = parsedSize.data
        const gradient = await generateGradient(params.id)

        const avatar = (
          <div
            style={{
              width: size,
              height: size,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(to bottom right, ${gradient.fromColor}, ${gradient.toColor})`,
            }}
          >
            {text !== '' && (
              <span
                style={{
                  fontFamily: 'Geist, Noto Sans TC, Noto Sans SC, Noto Sans JP',
                  fontWeight: 400,
                  fontSize: text.length > 0 ? (size * 0.9) / text.length : 0,
                  color: '#fff',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {text}
              </span>
            )}
          </div>
        )

        return new ImageResponse(avatar, {
          width: size,
          height: size,
          format: 'webp',
          fonts: text
            ? googleFonts([
                { name: 'Noto Sans TC', weight: 400 },
                { name: 'Noto Sans SC', weight: 400 },
                { name: 'Noto Sans JP', weight: 400 },
              ])
            : undefined,
          fontFamilies: ['Geist', 'Noto Sans TC', 'Noto Sans SC', 'Noto Sans JP'],
        })
      },
    },
  },
})

async function hash(str: string): Promise<number> {
  let sum = 0
  // SHA-1 only seeds deterministic avatar colors and is not used for security.
  // oxlint-disable-next-line sonarjs/hashing
  const buffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str))

  for (const n of new Uint8Array(buffer)) {
    sum += n
  }

  return sum
}

async function hue(str: string): Promise<number> {
  const n = await hash(str)
  return n % 360
}

async function generateGradient(username: string): Promise<{
  fromColor: string
  toColor: string
}> {
  const h = await hue(username)
  const first = color({ h, s: 0.95, l: 0.5 })
  const second = first.triad()[1]

  for (const background of [first, second]) {
    // Check the rounded output color to keep white text readable.
    while (color.readability(background.toHexString(), '#fff') < 4.5) {
      background.darken(1)
    }
  }

  return {
    fromColor: first.toHexString(),
    toColor: second.toHexString(),
  }
}
