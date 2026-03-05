import type { DecoratorProps } from 'react-cosmos-core'

import { NextIntlClientProvider } from 'next-intl'

import { Toaster } from './ui/sonner'

function Decorator(props: DecoratorProps) {
  const { children } = props

  return (
    <NextIntlClientProvider>
      <div className='mx-auto w-full max-w-3xl p-8'>
        {children}
        <Toaster />
      </div>
    </NextIntlClientProvider>
  )
}

export default Decorator
