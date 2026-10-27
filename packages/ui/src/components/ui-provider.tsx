import { createContext, use } from 'react'

export type UITranslations = {
  loading: string
  close: string
  commandDialogTitle: string
  commandDialogDescription: string
  treeView: string
}

const UITranslationsContext = createContext<UITranslations | undefined>(undefined)
UITranslationsContext.displayName = 'UITranslationsContext'

type UIProviderProps = {
  children: React.ReactNode
  translations: UITranslations
}

export function UIProvider(props: UIProviderProps) {
  const { children, translations } = props

  return <UITranslationsContext value={translations}>{children}</UITranslationsContext>
}

export function useUITranslation(key: keyof UITranslations, override?: string, required = true) {
  const translations = use(UITranslationsContext)

  if (override !== undefined || !required) return override
  if (translations === undefined) {
    throw new Error(`A default UI label for "${key}" requires <UIProvider>. Provide translations or an explicit label.`)
  }

  return translations[key]
}
