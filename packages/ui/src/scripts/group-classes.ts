const knownOrderRegex: RegExp[] = [
  /^base$/,
  /^dark:$/,
  // https://tailwindcss.com/docs/hover-focus-and-other-states#quick-reference
  /^hover:$/,
  /^focus:$/,
  /^focus-within:$/,
  /^focus-visible:$/,
  /^active:$/,
  /^visited:$/,
  /^target:$/,
  /^\*:$/,
  /^\*\*:$/,
  /^has-/,
  /^group-/,
  /^peer-/,
  /^in-/,
  /^not-/,
  /^inert:$/,
  /^first:$/,
  /^last:$/,
  /^only:$/,
  /^odd:$/,
  /^even:$/,
  /^first-of-type:$/,
  /^last-of-type:$/,
  /^only-of-type:$/,
  /^nth-/,
  /^nth-last-/,
  /^nth-of-type-/,
  /^nth-last-of-type-/,
  /^empty:$/,
  /^disabled:$/,
  /^enabled:$/,
  /^checked:$/,
  /^indeterminate:$/,
  /^default:$/,
  /^optional:$/,
  /^required:$/,
  /^valid:$/,
  /^invalid:$/,
  /^user-valid:$/,
  /^user-invalid:$/,
  /^in-range:$/,
  /^out-of-range:$/,
  /^placeholder-shown:$/,
  /^details-content:$/,
  /^autofill:$/,
  /^read-only:$/,
  /^before:$/,
  /^after:$/,
  /^first-letter:$/,
  /^first-line:$/,
  /^marker:$/,
  /^selection:$/,
  /^file:$/,
  /^backdrop:$/,
  /^placeholder:$/,
  /^sm:$/,
  /^md:$/,
  /^lg:$/,
  /^xl:$/,
  /^2xl:$/,
  /^min-/,
  /^max-sm:$/,
  /^max-md:$/,
  /^max-lg:$/,
  /^max-xl:$/,
  /^max-2xl:$/,
  /^max-/,
  /^@3xs:$/,
  /^@2xs:$/,
  /^@xs:$/,
  /^@sm:$/,
  /^@md:$/,
  /^@lg:$/,
  /^@xl:$/,
  /^@2xl:$/,
  /^@3xl:$/,
  /^@4xl:$/,
  /^@5xl:$/,
  /^@6xl:$/,
  /^@7xl:$/,
  /^@min-/,
  /^@max-3xs:$/,
  /^@max-2xs:$/,
  /^@max-xs:$/,
  /^@max-sm:$/,
  /^@max-md:$/,
  /^@max-lg:$/,
  /^@max-xl:$/,
  /^@max-2xl:$/,
  /^@max-3xl:$/,
  /^@max-4xl:$/,
  /^@max-5xl:$/,
  /^@max-6xl:$/,
  /^@max-7xl:$/,
  /^@max-/,
  /^motion-safe:$/,
  /^motion-reduce:$/,
  /^contrast-more:$/,
  /^contrast-less:$/,
  /^forced-colors:$/,
  /^inverted-colors:$/,
  /^pointer-fine:$/,
  /^pointer-coarse:$/,
  /^pointer-none:$/,
  /^any-pointer-fine:$/,
  /^any-pointer-coarse:$/,
  /^any-pointer-none:$/,
  /^portrait:$/,
  /^landscape:$/,
  /^noscript:$/,
  /^print:$/,
  /^supports-/,
  /^not-supports-/,
  /^aria-busy:$/,
  /^aria-checked:$/,
  /^aria-disabled:$/,
  /^aria-expanded:$/,
  /^aria-hidden:$/,
  /^aria-pressed:$/,
  /^aria-readonly:$/,
  /^aria-required:$/,
  /^aria-selected:$/,
  /^aria-/,
  /^data-/,
  /^rtl:$/,
  /^ltr:$/,
  /^open:$/,
  /^starting:$/
]

const getVariantChain = (className: string): string => {
  const regex = /^((?:\[[^\]]*\]|[^:[])+:)/
  const match = regex.exec(className)
  return match ? match[1]! : 'base'
}

const sortWildcardVariants = (keys: string[]): string[] => {
  // Separate built-in (no brackets) from arbitrary (with brackets)
  const builtIn = keys.filter((key) => !key.includes('['))
  const arbitrary = keys.filter((key) => key.includes('['))

  // Sort each group alphabetically using localeCompare
  builtIn.sort((a, b) => a.localeCompare(b))
  arbitrary.sort((a, b) => a.localeCompare(b))

  return [...builtIn, ...arbitrary]
}

const buildClassGroups = (classes: string[]) => {
  const groups = new Map<string, string[]>()
  const order: string[] = []

  for (const cls of classes) {
    const variantChain = getVariantChain(cls)
    if (!groups.has(variantChain)) {
      groups.set(variantChain, [])
      order.push(variantChain)
    }
    groups.get(variantChain)!.push(cls)
  }

  return { groups, order }
}

const processWildcardPattern = (
  pattern: RegExp,
  order: string[],
  groups: Map<string, string[]>,
  matchedKeys: Set<string>,
  result: string[]
) => {
  const matchingKeys = order.filter((key) => !matchedKeys.has(key) && pattern.test(key))

  if (matchingKeys.length === 0) return

  const sortedKeys = sortWildcardVariants(matchingKeys)

  for (const key of sortedKeys) {
    result.push(groups.get(key)!.join(' '))
    matchedKeys.add(key)
  }
}

const processExactPattern = (
  pattern: RegExp,
  order: string[],
  groups: Map<string, string[]>,
  matchedKeys: Set<string>,
  result: string[]
) => {
  for (const key of order) {
    if (!matchedKeys.has(key) && pattern.test(key)) {
      result.push(groups.get(key)!.join(' '))
      matchedKeys.add(key)
    }
  }
}

const addUnmatchedKeys = (
  order: string[],
  groups: Map<string, string[]>,
  matchedKeys: Set<string>,
  result: string[]
) => {
  for (const key of order) {
    if (!matchedKeys.has(key)) {
      result.push(groups.get(key)!.join(' '))
    }
  }
}

export const groupClasses = (classes: string[]): string[] => {
  const { groups, order } = buildClassGroups(classes)
  const result: string[] = []
  const matchedKeys = new Set<string>()

  for (const pattern of knownOrderRegex) {
    const isWildcardPattern = pattern.source.endsWith('-')

    if (isWildcardPattern) {
      processWildcardPattern(pattern, order, groups, matchedKeys, result)
    } else {
      processExactPattern(pattern, order, groups, matchedKeys, result)
    }
  }

  addUnmatchedKeys(order, groups, matchedKeys, result)

  return result
}
