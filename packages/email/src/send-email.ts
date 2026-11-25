import type { ReactElement } from 'react'

import { render, toPlainText } from 'react-email'
import { Resend } from 'resend'

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
  const resend = new Resend(ENV.RESEND_API_KEY)
  const { error } = await resend.emails.send(
    { from: ENV.RESEND_FROM_EMAIL, to, subject, html, text: toPlainText(html) },
    { signal: AbortSignal.timeout(3000) },
  )

  if (error) {
    throw new Error(`Email delivery failed: ${error.message}`)
  }
}
