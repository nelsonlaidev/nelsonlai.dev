import { ScriptOnce } from '@tanstack/react-router'
import { createContext, use, useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'

export type Theme = 'dark' | 'light' | 'system'

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const themeFallbacks = new Map<string, Theme>()

function getThemeScript(storageKey: string, defaultTheme: Theme) {
  const key = JSON.stringify(storageKey)
  const fallback = JSON.stringify(defaultTheme)

  return `(function(){try{var t=${fallback};try{var s=localStorage.getItem(${key});if(s==='light'||s==='dark'||s==='system'){t=s}}catch(e){}var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.classList.add(r);e.style.colorScheme=r}catch(e){}})();`
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)
ThemeProviderContext.displayName = 'ThemeProviderContext'

function subscribeToThemeChanges(onStoreChange: () => void) {
  globalThis.addEventListener('storage', onStoreChange)
  globalThis.addEventListener('theme-change', onStoreChange)

  return () => {
    globalThis.removeEventListener('storage', onStoreChange)
    globalThis.removeEventListener('theme-change', onStoreChange)
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')

  let resolved = theme
  if (theme === 'system') {
    resolved = globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  root.classList.add(resolved)
  root.style.colorScheme = resolved
}

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider(props: ThemeProviderProps) {
  const { children, defaultTheme = 'system', storageKey = 'theme' } = props

  const storedTheme = useSyncExternalStore(
    subscribeToThemeChanges,
    () => {
      const fallback = themeFallbacks.get(storageKey)
      if (fallback !== undefined) return fallback

      try {
        const stored = localStorage.getItem(storageKey)
        return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : defaultTheme
      } catch {
        return defaultTheme
      }
    },
    () => null,
  )
  const theme = storedTheme ?? defaultTheme

  useEffect(() => {
    if (storedTheme === null) return
    applyTheme(theme)
  }, [theme, storedTheme])

  useEffect(() => {
    if (storedTheme === null || theme !== 'system') return

    const media = globalThis.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      applyTheme('system')
    }
    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [theme, storedTheme])

  const setTheme = useCallback(
    (next: Theme) => {
      try {
        localStorage.setItem(storageKey, next)
        themeFallbacks.delete(storageKey)
      } catch {
        themeFallbacks.set(storageKey, next)
      }
      globalThis.dispatchEvent(new Event('theme-change'))
    },
    [storageKey],
  )
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return (
    <ThemeProviderContext value={value}>
      <ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>
      {children}
    </ThemeProviderContext>
  )
}

export function useTheme() {
  const context = use(ThemeProviderContext)
  if (context === undefined) throw new Error('useTheme must be used within a <ThemeProvider />')
  return context
}
