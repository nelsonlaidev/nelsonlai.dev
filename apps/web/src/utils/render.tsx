import messages from '@repo/i18n/messages/en.json'
import { render as baseRender, type RenderOptions, type RenderResult } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'

export const render = (ui: React.ReactNode, options?: RenderOptions): RenderResult => {
  return baseRender(ui, {
    wrapper: ({ children }) => (
      <NextIntlClientProvider locale='en' messages={messages}>
        {children}
      </NextIntlClientProvider>
    ),
    ...options
  })
}
