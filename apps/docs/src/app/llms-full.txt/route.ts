import { getLLMText, source } from '@/lib/source'

export const revalidate = false

export async function GET() {
  const scan = source.getPages().map((page) => getLLMText(page))
  const scanned = await Promise.all(scan)

  return new Response(scanned.join('\n\n'))
}
