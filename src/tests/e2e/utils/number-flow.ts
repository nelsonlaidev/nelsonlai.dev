import type { Locator } from '@playwright/test'

export async function getNumberFlow(locator: Locator) {
  return locator.evaluate((flow) => {
    // Internal properties are not typed.
    // @ts-expect-error - accessing internal property
    const ariaLabel = flow._internals.ariaLabel
    return typeof ariaLabel === 'string' ? ariaLabel : undefined
  })
}
