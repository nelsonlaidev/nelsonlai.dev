import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { toast } from '@/components/ui/toast'

type CopyOptions = {
  text: string
  timeout?: number
  successMessage?: React.ReactNode
  errorMessage?: React.ReactNode
}

export function useCopyToClipboard(): [(options: CopyOptions) => Promise<void>, boolean] {
  const [isCopied, setIsCopied] = useState(false)
  const t = useTranslations()

  async function copy({ text, timeout, successMessage, errorMessage }: CopyOptions) {
    if (isCopied) return

    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      toast.add({ type: 'success', title: successMessage ?? t('success.copied-to-clipboard') })

      setTimeout(() => {
        setIsCopied(false)
      }, timeout ?? 2000)
    } catch {
      toast.add({ type: 'error', title: errorMessage ?? t('error.copy-to-clipboard-error') })
    }
  }

  return [copy, isCopied]
}
