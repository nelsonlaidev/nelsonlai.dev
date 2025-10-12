import { env } from '@repo/env'
import { Resend } from 'resend'

type SendEmailOptions = {
  subject: string
  to: string
  react: React.ReactNode
}

export const sendEmail = (options: SendEmailOptions) => {
  if (!env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Skipping email sending.')
    return
  }

  const { subject, to, react } = options
  const resend = new Resend(env.RESEND_API_KEY)

  return resend.emails.send({
    from: `Nelson Lai <me@nelsonlai.dev>`,
    to,
    subject,
    react
  })
}
