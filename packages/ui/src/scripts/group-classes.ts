const knownOrderRegex: RegExp[] = [
  /^base$/,
  /^dark:$/,
  /^sm:$/,
  /^md:$/,
  /^lg:$/,
  /^xl:$/,
  /^2xl:$/,
  /^hover:$/,
  /^first:$/,
  /^last:$/,
  /^before:$/,
  /^after:$/,
  /^active:$/,
  /^file:$/,
  /^placeholder:$/,
  /^selection:$/,
  /^focus:$/,
  /^focus-visible:$/,
  /^focus-within:$/,
  /^aria-invalid:$/,
  /^aria-disabled:$/,
  /^disabled:$/,
  /^peer-disabled:$/,
  /^data-\[disabled\]:$/,
  /^data-\[inset\]:$/,
  /^data-\[placeholder\]:$/,
  /^data-\[disabled=true\]:$/,
  /^data-\[selected=true\]:$/,
  /^data-\[active=true\]:$/,
  /^data-\[state=open\]:$/,
  /^data-\[state=closed\]:$/,
  /^data-\[state=checked\]:$/,
  /^data-\[state=unchecked\]:$/,
  /^data-\[state=visible\]:$/,
  /^data-\[state=hidden\]:$/,
  /^data-\[state=collapsed\]:$/,
  /^data-\[state=active\]:$/,
  /^data-\[state=on\]:$/,
  /^data-\[side=top\]:$/,
  /^data-\[side=right\]:$/,
  /^data-\[side=bottom\]:$/,
  /^data-\[side=left\]:$/,
  /^data-\[size=default\]:$/,
  /^data-\[size=sm\]:$/,
  /^data-\[motion\^=from-\]:$/,
  /^data-\[motion\^=to-\]:$/,
  /^data-\[motion=from-start\]:$/,
  /^data-\[motion=from-end\]:$/,
  /^data-\[motion=to-start\]:$/,
  /^data-\[motion=to-end\]:$/,
  /^data-\[orientation=horizontal\]:$/,
  /^data-\[orientation=vertical\]:$/,
  /^data-\[collapsible=offcanvas\]:$/,
  /^data-\[collapsible=icon\]:$/,
  /^data-\[variant=destructive\]:$/,
  /^data-\[variant=inset\]:$/,
  /^data-\[variant=outline\]:$/,
  /^data-\[slot=select-value\]:$/,
  /^data-\[slot=command-input-wrapper\]:$/,
  /^data-\[slot=navigation-menu-link\]:$/,
  /^data-\[panel-group-direction=vertical\]:$/,
  /^data-\[vaul-drawer-direction=top\]:$/,
  /^data-\[vaul-drawer-direction=right\]:$/,
  /^data-\[vaul-drawer-direction=bottom\]:$/,
  /^data-\[vaul-drawer-direction=left\]:$/,
  /^group-data-\[viewport=false\]\/navigation-menu:$/,
  /^group-data-\[disabled=true\]:$/,
  /^group-data-\[side=left\]:$/,
  /^group-data-\[side=right\]:$/,
  /^group-data-\[collapsible=offcanvas\]:$/,
  /^group-data-\[collapsible=icon\]:$/,
  /^group-has-data-\[.*\]:$/,
  /^group-has-data-\[.*\]\/.*:$/,
  /^\*:$/,
  /^\*\*:$/,
  /^has-\[>svg\]:$/,
  /^\[&>svg\]:$/,
  /^\[&_svg\]:$/,
  /^\[&_svg:not\(\[class\*='text-'\]\)\]:$/,
  /^\[&_svg:not\(\[class\*='size-'\]\)\]:$/,
  /^\[&>span:last-child\]:$/,
  /^\[&>.*\]:$/,
  /^\[&.*\]:$/,
  /^\[&.*\]\]:$/
]

const getVariantChain = (className: string): string => {
  const regex = /^((?:\[[^\]]*\]|[^:[])+:)/
  const match = regex.exec(className)
  return match ? match[1]! : 'base'
}

export const groupClasses = (classes: string[]): string[] => {
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

  const result: string[] = []
  const matchedKeys = new Set<string>()

  for (const pattern of knownOrderRegex) {
    for (const key of order) {
      if (!matchedKeys.has(key) && pattern.test(key)) {
        result.push(groups.get(key)!.join(' '))
        matchedKeys.add(key)
      }
    }
  }

  for (const key of order) {
    if (!matchedKeys.has(key)) {
      result.push(groups.get(key)!.join(' '))
    }
  }

  return result
}
