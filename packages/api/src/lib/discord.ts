import { ENV } from '../env'

export async function sendGuestbookNotification(body: string, name: string, image: string | null) {
  if (!import.meta.env.PROD || !ENV.DISCORD_WEBHOOK_URL) return

  try {
    const response = await fetch(ENV.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000),
      body: JSON.stringify({
        username: 'Guestbook Bot',
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: 'New message on the guestbook!',
            description: body,
            url: `${ENV.SITE_URL}/guestbook`,
            author: { name, ...(image ? { icon_url: image } : {}) },
          },
        ],
      }),
    })

    if (!response.ok) {
      console.warn('[Guestbook] Notification failed:', response.status)
    }
  } catch {
    console.warn('[Guestbook] Notification could not be delivered')
  }
}
