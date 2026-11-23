import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { CommentEmailTemplate, ReplyEmailTemplate } from '@repo/email'
import { chromium } from 'playwright'
import { render } from 'react-email'
import sharp from 'sharp'
import { preview } from 'vite'

const images = new URL('../../../.github/images/', import.meta.url)
const webRoot = fileURLToPath(new URL('../../../apps/web/', import.meta.url))
const port = 4173
const siteUrl = `http://localhost:${port}`
const server = await preview({ root: webRoot, preview: { host: 'localhost', port, strictPort: true } })

try {
  await using browser = await chromium.launch()

  const page = await browser.newPage({
    viewport: { width: 1440, height: 820 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
    locale: 'en-US',
  })

  await page.goto(siteUrl)
  await page.locator('#home-title').waitFor()

  const header = await page.screenshot({ animations: 'disabled' })

  const templates = [
    { name: 'comment', element: <CommentEmailTemplate {...CommentEmailTemplate.PreviewProps} siteUrl={siteUrl} /> },
    { name: 'reply', element: <ReplyEmailTemplate {...ReplyEmailTemplate.PreviewProps} siteUrl={siteUrl} /> },
  ]

  const emails = await Promise.all(
    templates.map(async ({ name, element }) => {
      const email = await browser.newPage({ viewport: { width: 660, height: 480 }, deviceScaleFactor: 2 })
      const url = new URL(`/__readme/${name}.html`, siteUrl).href
      const html = await render(element)

      await email.route(url, async (route) => route.fulfill({ body: html, contentType: 'text/html' }))
      await email.goto(url)
      await email.getByRole('heading', { level: 1 }).waitFor()
      await email.evaluate(async () => Promise.all(Array.from(document.images, async (image) => image.decode())))

      return [`${name}-notification-email.png`, await email.screenshot({ fullPage: true })] as const
    }),
  )

  await mkdir(images, { recursive: true })

  await Promise.all(
    [['header.png', header] as const, ...emails].map(async ([filename, png]) => {
      const image = sharp(png)
      const { width, height } = await image.metadata()
      const mask = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" rx="32"/></svg>`,
      )
      await image
        .composite([{ input: mask, blend: 'dest-in' }])
        .png()
        .toFile(fileURLToPath(new URL(filename, images)))
    }),
  )
} catch (error) {
  console.error(error)
  process.exitCode = 1
} finally {
  await server.close()
}
