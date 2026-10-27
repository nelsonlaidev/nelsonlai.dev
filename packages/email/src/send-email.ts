import type { ReactElement } from 'react'

import { render, toPlainText } from 'react-email'

import { ENV } from './env'

type SendEmailOptions = {
  to: string
  subject: string
  react: ReactElement
}

export async function sendEmail(options: SendEmailOptions) {
  if (!ENV.RESEND_API_KEY || !ENV.RESEND_FROM_EMAIL) return

  const { to, subject, react } = options
  const html = await render(react)
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${ENV.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(3000),
    body: JSON.stringify({ from: ENV.RESEND_FROM_EMAIL, to, subject, html, text: toPlainText(html) }),
  })

  if (!response.ok) throw new Error(`Email delivery failed: HTTP ${response.status}`)
}
