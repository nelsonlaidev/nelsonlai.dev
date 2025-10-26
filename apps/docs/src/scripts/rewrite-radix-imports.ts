import { Node, type SourceFile, SyntaxKind } from 'ts-morph'

import { toPascal } from './to-pascal'

/**
 * Rewrites Radix UI imports from individual packages to a unified 'radix-ui' package.
 *
 * This function converts namespace imports from `@radix-ui/react-*` to named imports from 'radix-ui'
 *    - Example: `import * as AccordionPrimitive from '@radix-ui/react-accordion'`
 *    - Becomes: `import { Accordion as AccordionPrimitive } from 'radix-ui'`
 *
 * @param sourceFile - The TypeScript source file to process
 */
export const rewriteRadixImports = (sourceFile: SourceFile) => {
  for (const imp of sourceFile.getImportDeclarations()) {
    const mod = imp.getModuleSpecifierValue()
    const m = /^@radix-ui\/react-([\w-]+)$/i.exec(mod)
    if (!m) continue

    const ns = imp.getNamespaceImport()
    if (!ns) {
      imp.setModuleSpecifier('radix-ui')
      continue
    }

    const alias = ns.getText() // e.g. AccordionPrimitive
    const proper = toPascal(m[1]!) // e.g. Accordion
    imp.replaceWithText(`import { ${proper} as ${alias} } from 'radix-ui'`)
  }

  // Convert any bare import() of @radix-ui/react-* to 'radix-ui'
  sourceFile.forEachDescendant((n) => {
    if (Node.isCallExpression(n)) {
      const expr = n.getExpression()
      if (expr.getKind() === SyntaxKind.ImportKeyword) {
        const [arg] = n.getArguments()
        if (Node.isStringLiteral(arg) && arg.getLiteralText().startsWith('@radix-ui/react-')) {
          arg.replaceWithText(`'radix-ui'`)
        }
      }
    }
  })
}
