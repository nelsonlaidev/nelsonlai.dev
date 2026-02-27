import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'

export const THEMES = [
  // i18n-check t('theme-toggle.options.light')
  { labelKey: 'theme-toggle.options.light', value: 'light', icon: <SunIcon /> },
  // i18n-check t('theme-toggle.options.dark')
  { labelKey: 'theme-toggle.options.dark', value: 'dark', icon: <MoonIcon /> },
  // i18n-check t('theme-toggle.options.system')
  { labelKey: 'theme-toggle.options.system', value: 'system', icon: <MonitorIcon /> },
] as const
