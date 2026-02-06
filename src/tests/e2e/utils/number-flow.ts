import type { Locator } from '@playwright/test'

export async function getNumberFlow(locator: Locator) {
  // Internal properties are not typed.
  // @ts-expect-error
  return locator.evaluate((flow) => flow._internals.ariaLabel) as Promise<string | undefined>
}
