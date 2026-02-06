import type { RESTPostAPIWebhookWithTokenFormDataBody } from 'discord-api-types/rest'

import { env } from '@/lib/env'

const BOT_AVATAR_URL = 'https://cdn.discordapp.com/avatars/1123845082672537751/8af603a10f1d2f86ebc922ede339cd3a.webp'

async function sendWebhook(body: RESTPostAPIWebhookWithTokenFormDataBody) {
  if (!env.DISCORD_WEBHOOK_URL) return

  await fetch(env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export async function sendGuestbookNotification(message: string, userName: string, userImage: string) {
  const body: RESTPostAPIWebhookWithTokenFormDataBody = {
    username: 'Guestbook Bot',
    avatar_url: BOT_AVATAR_URL,
    embeds: [
      {
        title: 'New message on the guestbook!',
        description: message,
        url: 'https://nelsonlai.dev/guestbook',
        color: 6_609_519,
        author: {
          name: userName,
          icon_url: userImage,
        },
        timestamp: new Date().toISOString(),
      },
    ],
  }

  await sendWebhook(body)
}
