import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

type CopyOptions = {
  text: string
  timeout?: number
  successMessage?: React.ReactNode
  errorMessage?: React.ReactNode
}

export const useCopyToClipboard = (): [(options: CopyOptions) => Promise<void>, boolean] => {
  const [isCopied, setIsCopied] = useState(false)
  const t = useTranslations()

  const copy = async ({ text, timeout, successMessage, errorMessage }: CopyOptions) => {
    if (isCopied) return

    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      toast.success(successMessage ?? t('success.copied-to-clipboard'))

      setTimeout(() => {
        setIsCopied(false)
      }, timeout ?? 2000)
    } catch {
      toast.error(errorMessage ?? t('error.copy-to-clipboard-error'))
    }
  }

  return [copy, isCopied]
}
