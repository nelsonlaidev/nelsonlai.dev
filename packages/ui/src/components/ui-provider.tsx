import { CSPProvider } from '@base-ui/react/csp-provider'
import { createContext, use } from 'react'

export type UITranslations = {
  loading: string
  close: string
  commandDialogTitle: string
  commandDialogDescription: string
  treeView: string
  sidebarTitle: string
  sidebarDescription: string
  toggleSidebar: string
}

const UITranslationsContext = createContext<UITranslations | undefined>(undefined)
UITranslationsContext.displayName = 'UITranslationsContext'

const CspNonceContext = createContext<string | undefined>(undefined)
CspNonceContext.displayName = 'CspNonceContext'

type UIProviderProps = {
  children: React.ReactNode
  translations: UITranslations
  nonce?: string
}

export function UIProvider(props: UIProviderProps) {
  const { children, translations, nonce } = props

  return (
    <CspNonceContext value={nonce}>
      <CSPProvider nonce={nonce} disableStyleElements>
        <UITranslationsContext value={translations}>{children}</UITranslationsContext>
      </CSPProvider>
    </CspNonceContext>
  )
}

export function useUITranslation(key: keyof UITranslations, override?: string, required = true) {
  const translations = use(UITranslationsContext)

  if (override !== undefined || !required) return override
  if (translations === undefined) {
    throw new Error(`A default UI label for "${key}" requires <UIProvider>. Provide translations or an explicit label.`)
  }

  return translations[key]
}

/** Share the current document nonce with components that inject styles. */
export function useCspNonce() {
  return use(CspNonceContext)
}
