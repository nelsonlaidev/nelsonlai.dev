import { Node, type SourceFile, SyntaxKind } from 'ts-morph'

/**
 * Rewrites CVA function calls to use the beta API format.
 *
 * This function transforms CVA calls from the old API format with two arguments
 * (base classes string and config object) to the new beta API format with a single
 * object argument that includes the base classes as a property.
 *
 * @param sourceFile - The TypeScript source file to transform
 *
 * @example
 * // Before (old API):
 * const buttonVariants = cva('base classes', {
 *   variants: { ... },
 *   defaultVariants: { ... }
 * })
 *
 * // After (beta API):
 * const buttonVariants = cva({
 *   base: 'base classes',
 *   variants: { ... },
 *   defaultVariants: { ... }
 * })
 */
export const rewriteCvaArgs = (sourceFile: SourceFile) => {
  const cvaCalls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression).filter((call) => {
    const expr = call.getExpression()
    if (!Node.isIdentifier(expr) || expr.getText() !== 'cva') return false

    const symbol = expr.getSymbol()
    const declaration = symbol?.getDeclarations()[0]
    if (!declaration || !Node.isImportSpecifier(declaration)) return false

    const importDeclaration = declaration.getFirstAncestorByKind(SyntaxKind.ImportDeclaration)
    const importFrom = importDeclaration?.getModuleSpecifierValue()
    return importFrom === 'cva'
  })

  for (const call of cvaCalls) {
    const args = call.getArguments()
    if (args.length !== 2) continue

    const [firstArg, secondArg] = args

    const isStringBase = Node.isStringLiteral(firstArg) || Node.isNoSubstitutionTemplateLiteral(firstArg)
    if (!isStringBase || !Node.isObjectLiteralExpression(secondArg)) continue

    const propsText = secondArg
      .getProperties()
      .map((p) => p.getText())
      .join(', ')
    const baseText = `base: ${firstArg.getText()}`
    const newObjectText = `{ ${baseText}${propsText ? ', ' + propsText : ''} }`

    call.removeArgument(firstArg)
    call.removeArgument(secondArg)

    call.addArgument(newObjectText)
  }
}
