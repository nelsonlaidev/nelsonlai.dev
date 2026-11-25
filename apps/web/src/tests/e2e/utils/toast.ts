import type { Page } from '@playwright/test'

import { COMMON_ERROR_STATUS_MAP, ORPCError } from '@orpc/client'

export function toastTitle(page: Page, type: 'success' | 'error', title: string) {
  const toast = page.locator(`[data-slot="toast"][data-type="${type}"]`)
  return toast.getByText(title, { exact: true })
}

export async function rejectRpc(
  page: Page,
  procedure: string,
  code: 'INTERNAL_SERVER_ERROR' | 'TOO_MANY_REQUESTS' | 'BAD_REQUEST',
) {
  const error = new ORPCError(code)

  await page.route(`**/api/rpc/${procedure}`, async (route) =>
    route.fulfill({ status: COMMON_ERROR_STATUS_MAP[code], json: { json: error.toJSON() } }),
  )
}
