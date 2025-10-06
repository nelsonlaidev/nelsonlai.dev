import type { RESTPostAPIWebhookWithTokenFormDataBody } from 'discord-api-types/rest'

import { env } from '@repo/env'

export const sendGuestbookNotification = async (message: string, userName: string, userImage: string) => {
  if (!env.DISCORD_WEBHOOK_URL) return

  const body: RESTPostAPIWebhookWithTokenFormDataBody = {
    username: 'Guestbook Bot',
    avatar_url: 'https://cdn.discordapp.com/avatars/1123845082672537751/8af603a10f1d2f86ebc922ede339cd3a.webp',
    embeds: [
      {
        title: 'New message on the guestbook!',
        description: message,
        url: 'https://nelsonlai.dev/guestbook',
        color: 6_609_519,
        author: {
          name: userName,
          icon_url: userImage
        },
        timestamp: new Date().toISOString()
      }
    ]
  }

  await fetch(env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}
