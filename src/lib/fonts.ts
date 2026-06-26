import type { SatoriOptions } from 'next/dist/compiled/@vercel/og/satori'

import fs from 'node:fs/promises'
import path from 'node:path'

import { cache } from 'react'

function getFontPath(fontName: string) {
  return path.join(process.cwd(), 'src', 'assets', 'fonts', fontName)
}

const getGeistRegularFont = cache(async () => {
  const data = await fs.readFile(getFontPath('Geist-Regular.ttf'))
  return Uint8Array.from(data).buffer
})

const getGeistSemiBoldFont = cache(async () => {
  const data = await fs.readFile(getFontPath('Geist-SemiBold.ttf'))
  return Uint8Array.from(data).buffer
})

const getNotoSansTCRegularFont = cache(async () => {
  const data = await fs.readFile(getFontPath('NotoSansTC-Regular.ttf'))
  return Uint8Array.from(data).buffer
})

const getNotoSansTCSemiBoldFont = cache(async () => {
  const data = await fs.readFile(getFontPath('NotoSansTC-SemiBold.ttf'))
  return Uint8Array.from(data).buffer
})

const getNotoSansSCRegularFont = cache(async () => {
  const data = await fs.readFile(getFontPath('NotoSansSC-Regular.ttf'))
  return Uint8Array.from(data).buffer
})

const getNotoSansSCSemiBoldFont = cache(async () => {
  const data = await fs.readFile(getFontPath('NotoSansSC-SemiBold.ttf'))
  return Uint8Array.from(data).buffer
})

export async function getOGImageFonts(): Promise<SatoriOptions['fonts']> {
  const [geistRegular, geistSemiBold, tcRegular, tcSemiBold, scRegular, scSemiBold] = await Promise.all([
    getGeistRegularFont(),
    getGeistSemiBoldFont(),
    getNotoSansTCRegularFont(),
    getNotoSansTCSemiBoldFont(),
    getNotoSansSCRegularFont(),
    getNotoSansSCSemiBoldFont(),
  ])

  return [
    { name: 'Geist Sans', data: geistRegular, style: 'normal', weight: 400 },
    { name: 'Geist Sans', data: geistSemiBold, style: 'normal', weight: 600 },
    { name: 'Noto Sans TC', data: tcRegular, style: 'normal', weight: 400 },
    { name: 'Noto Sans TC', data: tcSemiBold, style: 'normal', weight: 600 },
    { name: 'Noto Sans SC', data: scRegular, style: 'normal', weight: 400 },
    { name: 'Noto Sans SC', data: scSemiBold, style: 'normal', weight: 600 },
  ]
}
