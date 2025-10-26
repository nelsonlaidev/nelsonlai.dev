import { Node, type SourceFile, SyntaxKind } from 'ts-morph'

import { groupClasses } from './group-classes'

/**
 * Formats bare className strings by converting them to `cn()` calls when grouping produces multiple strings.
 *
 * This function finds all JSX `className` attributes that contain plain string literals
 * (not already using `cn()` or other expressions), and transforms them only if the
 * `groupClasses` utility splits them into multiple groups. If grouping results in a
 * single string (same as the original), the className is left unchanged.
 *
 * @param sourceFile - The TypeScript source file to transform
 *
 * @example
 * // Before (multiple groups):
 * <div className="border-b last:border-b-0" />
 *
 * // After (wrapped in cn()):
 * <div className={cn("border-b", "last:border-b-0")} />
 *
 * @example
 * // Before (single group):
 * <div className="flex items-center gap-4" />
 *
 * // After (unchanged):
 * <div className="flex items-center gap-4" />
 */
export const formatClasses = (sourceFile: SourceFile) => {
  const classNameAttrs = sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute).filter((attr) => {
    if (attr.getNameNode().getText() !== 'className') return false
    const initializer = attr.getInitializer()
    return Node.isStringLiteral(initializer)
  })

  for (const attr of classNameAttrs) {
    const initializer = attr.getInitializer()
    if (!Node.isStringLiteral(initializer)) continue

    const raw = initializer.getLiteralText()
    const tokens = raw.trim().split(/\s+/).filter(Boolean)
    if (tokens.length === 0) continue

    const grouped = groupClasses(tokens)

    if (grouped.length === 1) continue

    const groupedClasses = grouped.map((c) => `"${c}"`).join(', ')
    const newText = `{cn(${groupedClasses})}`
    initializer.replaceWithText(newText)
  }
}
