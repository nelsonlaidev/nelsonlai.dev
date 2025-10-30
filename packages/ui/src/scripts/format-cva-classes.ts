import { Node, type SourceFile, SyntaxKind } from 'ts-morph'

import { groupClasses } from './group-classes'

/**
 * Formats the classes inside `cva({ base: '...' })` calls by grouping them by variant chains.
 *
 * This function finds all `cva()` function calls that are imported from `cva`,
 * and formats the `base` property string by:
 * 1. Splitting the class string into individual tokens
 * 2. Grouping classes by their variant chains (e.g., base classes, `hover:`, `last:`, `data-[state]:`)
 * 3. Replacing the original string with an array of quoted strings, one per variant group
 *
 * Unlike `formatClasses` and `formatCnClasses`, this function always converts the string to an array,
 * even if grouping results in a single string.
 *
 * @param sourceFile - The TypeScript source file to transform
 *
 * @example
 * // Before (mixed variant chains):
 * cva({ base: 'flex items-center hover:bg-red-500 last:border-b-0' })
 *
 * // After (grouped by variant chain in array):
 * cva({ base: ["flex items-center", "hover:bg-red-500", "last:border-b-0"] })
 *
 * @example
 * // Before (only base classes):
 * cva({ base: 'flex items-center gap-4' })
 *
 * // After (still converted to array):
 * cva({ base: ["flex items-center gap-4"] })
 */
export const formatCvaClasses = (sourceFile: SourceFile) => {
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
    if (!args[0]) continue

    const firstArg = args[0]
    if (!Node.isObjectLiteralExpression(firstArg)) continue

    const baseProp = firstArg.getProperty('base')
    if (!baseProp || !Node.isPropertyAssignment(baseProp)) continue

    const initializer = baseProp.getInitializer()
    if (!initializer) continue

    if (!Node.isStringLiteral(initializer) && !Node.isNoSubstitutionTemplateLiteral(initializer)) continue

    const raw = initializer.getLiteralText()
    const tokens = raw.trim().split(/\s+/).filter(Boolean)
    if (tokens.length === 0) continue

    const groupedClasses = groupClasses(tokens)
      .map((c) => `"${c}"`)
      .join(', ')

    const newText = `[${groupedClasses}]`

    initializer.replaceWithText(newText)
  }
}
