import type { Locale } from '@/paraglide/runtime'

import { render } from 'takumi-js'
import { googleFonts } from 'takumi-js/helpers'

import { m } from '@/paraglide/messages'

// Two crisp Takumi text plates, composed with native SVG clipping paths.
// No shader, browser, baked texture, or GPU is involved in the build.
export async function surfacePoster(font: Uint8Array, logo: string, locale: Locale, fontFamily: string) {
  const plate = async (color: string) =>
    `data:image/png;base64,${Buffer.from(
      await render(
        <div style={{ width: 1200, height: 630, position: 'relative', fontFamily: 'Geist' }}>
          <div
            style={{
              position: 'absolute',
              left: 62,
              top: 163,
              fontSize: 290,
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: -14,
              color,
            }}
          >
            Seafold
          </div>
        </div>,
        { width: 1200, height: 630, format: 'png', fonts: [font] },
      ),
    ).toString('base64')}`
  const upper = await plate('#0a3543'),
    lower = await plate('#b8d9cd')
  const wave =
    'M-5 344 C70 332 122 354 205 338 S325 350 405 331 S535 342 620 323 S755 335 840 315 S970 324 1050 307 S1150 316 1205 300'
  const ocean = `${wave} L1205 635 L-5 635 Z`
  const air = `${wave} L1205 -5 L-5 -5 Z`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="air" x2="0" y2="1"><stop stop-color="#eef0df"/><stop offset="1" stop-color="#bed5cd"/></linearGradient>
    <linearGradient id="deep" x1="0" y1="0" x2=".5" y2="1"><stop stop-color="#1c6070"/><stop offset=".45" stop-color="#0b3b52"/><stop offset="1" stop-color="#031a2e"/></linearGradient>
    <linearGradient id="ray" x2="0" y2="1"><stop stop-color="#c0e5cf" stop-opacity=".16"/><stop offset="1" stop-color="#c0e5cf" stop-opacity="0"/></linearGradient>
    <clipPath id="air-clip"><path d="${air}"/></clipPath><clipPath id="sea-clip"><path d="${ocean}"/></clipPath>
    <clipPath id="slice1"><rect y="300" width="1200" height="55"/></clipPath><clipPath id="slice2"><rect y="355" width="1200" height="24"/></clipPath><clipPath id="slice3"><rect y="379" width="1200" height="251"/></clipPath>
  </defs>
  <rect width="1200" height="630" fill="url(#air)"/>
  <image xlink:href="${upper}" width="1200" height="630" clip-path="url(#air-clip)"/>
  <path d="${ocean}" fill="url(#deep)"/>
  <g clip-path="url(#sea-clip)">
    <path d="M190 300 L330 300 L530 630 L390 630Z" fill="url(#ray)"/>
    <path d="M360 300 L410 300 L640 630 L600 630Z" fill="url(#ray)"/>
    <g clip-path="url(#slice1)"><image xlink:href="${lower}" x="3" y="3" width="1200" height="630"/></g>
    <g clip-path="url(#slice2)"><image xlink:href="${lower}" x="1" y="3" width="1200" height="630"/></g>
    <g clip-path="url(#slice3)"><image xlink:href="${lower}" x="4" y="3" width="1200" height="630"/></g>
  </g>
  <path d="${wave}" fill="none" stroke="#d5e9d7" stroke-width="1.5"/>
  <g fill="#87b8b1" opacity=".65"><path d="M884 487q12-8 24 0q-12 8-24 0l-8 6v-12Z"/><path d="M932 508q9-6 18 0q-9 6-18 0l-6 4v-8Z"/><path d="M1012 474q7-4 14 0q-7 4-14 0l-5 3v-6Z"/></g>
  </svg>`
  const art = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  return render(
    <div style={{ width: 1200, height: 630, position: 'relative', fontFamily: 'Geist' }}>
      <img alt='' src={art} width={1200} height={630} />
      <div style={{ position: 'absolute', left: 72, top: 58, fontSize: 26, color: '#244f57' }}>Nelson Lai</div>
      <img alt='' src={logo} width={70} height={70} style={{ position: 'absolute', right: 65, bottom: 42 }} />
      <div style={{ position: 'absolute', left: 72, bottom: 53, fontFamily, fontSize: 28, color: '#c4dcd3' }}>
        {m.home_og_tagline({}, { locale })}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      format: 'webp',
      lossless: true,
      lang: locale,
      fonts: [font, ...(fontFamily === 'Geist' ? [] : await googleFonts([fontFamily]))],
    },
  )
}
