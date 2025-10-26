import { type SourceFile, SyntaxKind } from 'ts-morph'

/**
 * Rewrites React namespace imports to named imports based on actual usage.
 *
 * This function analyzes a source file for React function calls (e.g., `React.useState`)
 * and converts namespace imports (`import * as React from 'react'`) to named imports
 * (`import { useState } from 'react'`) containing only the functions that are actually used.
 *
 * @param sourceFile - The TypeScript source file to transform
 *
 * @example
 * // Before:
 * import * as React from 'react'
 * const [state, setState] = React.useState(0)
 * React.useEffect(() => {}, [])
 *
 * // After:
 * import { useState, useEffect } from 'react'
 * const [state, setState] = useState(0)
 * useEffect(() => {}, [])
 */
export const rewriteReactImports = (sourceFile: SourceFile) => {
  const used = new Set<string>()

  const reactCalls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression).filter((call) => {
    const expr = call.getExpression()
    return expr.getText().includes('React.')
  })

  for (const call of reactCalls) {
    const expr = call.getExpression()
    const fn = expr.getText().replace('React.', '')

    used.add(fn)

    expr.replaceWithText(fn)
  }

  for (const imp of sourceFile.getImportDeclarations()) {
    if (imp.getModuleSpecifierValue() !== 'react') continue

    if (used.size === 0) {
      if (imp.getNamespaceImport()) imp.remove()
    } else {
      imp.replaceWithText(`import { ${[...used].join(', ')} } from 'react'`)
    }
  }
}
