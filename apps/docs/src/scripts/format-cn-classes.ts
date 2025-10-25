import { Node, type SourceFile, SyntaxKind } from 'ts-morph'

import { groupClasses } from './group-classes'

/**
 * Formats classes inside existing `cn()` calls by grouping them by variant chains.
 *
 * This function finds all `cn()` function calls that are imported from `@repo/ui/utils/cn`,
 * and processes any string literal or template literal arguments by:
 * 1. Splitting the class string into individual tokens
 * 2. Grouping classes by their variant chains (e.g., base classes, `hover:`, `last:`, `data-[state]:`)
 * 3. Replacing the original string with multiple quoted strings, one per variant group
 *
 * Unlike `formatClasses`, this function always applies grouping to strings within `cn()` calls,
 * regardless of whether grouping produces multiple strings or not.
 *
 * @param sourceFile - The TypeScript source file to transform
 *
 * @example
 * // Before (mixed variant chains in one string):
 * cn('border-b hover:border-blue-500 last:border-b-0')
 *
 * // After (grouped by variant chain):
 * cn("border-b", "hover:border-blue-500", "last:border-b-0")
 *
 * @example
 * // Before (multiple base classes and variants):
 * cn('flex items-center gap-4 hover:bg-red-500 focus:ring-2')
 *
 * // After (base classes together, variants separated):
 * cn("flex items-center gap-4", "hover:bg-red-500", "focus:ring-2")
 */
export const formatCnClasses = (sourceFile: SourceFile) => {
  const cnCalls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression).filter((call) => {
    const expr = call.getExpression()
    if (!Node.isIdentifier(expr) || expr.getText() !== 'cn') return false

    const symbol = expr.getSymbol()
    const declaration = symbol?.getDeclarations()[0]
    if (!declaration || !Node.isImportSpecifier(declaration)) return false

    const importDeclaration = declaration.getFirstAncestorByKind(SyntaxKind.ImportDeclaration)
    const importFrom = importDeclaration?.getModuleSpecifierValue()
    return importFrom === '@repo/ui/utils/cn'
  })

  for (const call of cnCalls) {
    const args = call.getArguments()

    for (const arg of args) {
      if (!Node.isStringLiteral(arg) && !Node.isNoSubstitutionTemplateLiteral(arg)) continue

      const raw = arg.getLiteralText()
      const tokens = raw.trim().split(/\s+/).filter(Boolean)
      if (tokens.length === 0) continue

      const groupedClasses = groupClasses(tokens)
        .map((c) => `"${c}"`)
        .join(', ')

      arg.replaceWithText(groupedClasses)
    }
  }
}
