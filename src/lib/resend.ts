import { Resend } from 'resend'

import { ENV } from '@/env'

type SendEmailOptions = {
  subject: string
  to: string
  react: React.ReactNode
}

export async function sendEmail(options: SendEmailOptions) {
  if (!ENV.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Skipping email sending.')
    return
  }

  const { subject, to, react } = options
  const resend = new Resend(ENV.RESEND_API_KEY)

  return resend.emails.send({
    from: ENV.RESEND_FROM_EMAIL,
    to,
    subject,
    react,
  })
}
