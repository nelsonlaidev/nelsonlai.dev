import type { Page } from '@playwright/test'

import { AxeBuilder } from '@axe-core/playwright'
import { expect } from '@playwright/test'

const A11Y_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

type Options = {
  page: Page
}

export async function a11y(options: Options) {
  const { page } = options

  const { violations } = await new AxeBuilder({ page }).disableRules(['color-contrast']).withTags(A11Y_TAGS).analyze()

  if (violations.length > 0) {
    console.warn(
      violations
        .map(
          (violation) => `
==================================================
Description: ${violation.description}
Impact: ${violation.impact}
Help: ${violation.help}
Help URL: ${violation.helpUrl}
Failure Summary: ${violation.nodes[0]?.failureSummary}
HTML: ${violation.nodes[0]?.html}
==================================================
      `,
        )
        .join('\n'),
    )
  }

  expect(violations).toHaveLength(0)
}
