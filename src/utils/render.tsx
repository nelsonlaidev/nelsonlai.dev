import { render as baseRender, type RenderOptions, type RenderResult } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'

import messages from '@/i18n/messages/en.json'

export function render(ui: React.ReactNode, options?: RenderOptions): RenderResult {
  return baseRender(ui, {
    wrapper: ({ children }) => (
      <NextIntlClientProvider locale='en' messages={messages}>
        {children}
      </NextIntlClientProvider>
    ),
    ...options,
  })
}
