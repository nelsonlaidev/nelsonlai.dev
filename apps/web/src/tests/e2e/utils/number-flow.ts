import type { Locator } from '@playwright/test'

export async function getNumberFlow(locator: Locator) {
  // @ts-expect-error -- Internal property
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- internal property
  return locator.evaluate((flow) => flow._internals.ariaLabel) as Promise<string | undefined>
}
