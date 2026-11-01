import { expect, test } from '../fixtures/test'
import { checkAppliedTheme, checkStoredTheme, setThemeInLocalStorage } from '../utils/theme'

function getInitialTheme(theme: string) {
  return theme === 'light' ? 'dark' : 'light'
}

test.describe('theme', () => {
  // The Seafold layout has no theme picker; theme selection follows system preferences or stored overrides.
  test.describe('live system preference', () => {
    for (const theme of ['light', 'dark'] as const) {
      test(`switches to ${theme} when the system preference changes without a stored override`, async ({ page }) => {
        const initialTheme = getInitialTheme(theme)

        await page.emulateMedia({ colorScheme: initialTheme })

        await page.goto('/')

        await checkAppliedTheme(page, initialTheme)

        await page.emulateMedia({ colorScheme: theme })

        await checkAppliedTheme(page, theme)
        await expect(page.locator('html')).toHaveCSS('color-scheme', theme)

        await page.emulateMedia({ colorScheme: initialTheme })
        await checkAppliedTheme(page, initialTheme)
        await expect(page.locator('html')).toHaveCSS('color-scheme', initialTheme)
        expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull()
      })
    }
  })

  test.describe('system preference', () => {
    const testCases = [
      { preferredColorScheme: 'light', expectedTheme: 'light' },
      { preferredColorScheme: 'dark', expectedTheme: 'dark' },
    ] as const

    for (const { preferredColorScheme, expectedTheme } of testCases) {
      test(`renders ${expectedTheme} theme if preferred-colorscheme is ${preferredColorScheme}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: preferredColorScheme })

        await setThemeInLocalStorage(page, 'system')

        await page.goto('/')

        await checkStoredTheme(page, 'system')
        await checkAppliedTheme(page, expectedTheme)

        const nextTheme = getInitialTheme(expectedTheme)
        await page.emulateMedia({ colorScheme: nextTheme })

        await checkAppliedTheme(page, nextTheme)
        await checkStoredTheme(page, 'system')
      })
    }
  })

  test.describe('storage persistence', () => {
    for (const theme of ['light', 'dark'] as const) {
      test(`renders ${theme} theme directly from localStorage`, async ({ page }) => {
        await page.goto('/')
        // Seed once so reload verifies persistence rather than reapplying an init script.
        await page.evaluate((value) => {
          localStorage.setItem('theme', value)
        }, theme)
        await page.reload()

        await checkStoredTheme(page, theme)
        await checkAppliedTheme(page, theme)

        await page.emulateMedia({ colorScheme: getInitialTheme(theme) })
        await checkAppliedTheme(page, theme)
        await checkStoredTheme(page, theme)

        await page.reload()
        await checkAppliedTheme(page, theme)
        await checkStoredTheme(page, theme)
      })
    }
  })
})
