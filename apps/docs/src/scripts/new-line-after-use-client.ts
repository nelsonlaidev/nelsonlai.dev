import { Node, type SourceFile, SyntaxKind } from 'ts-morph'

/**
 * Ensures a blank line exists after the 'use client' directive.
 *
 * This function checks if the first statement in a source file is a 'use client'
 * directive and adds a blank line after it if one doesn't already exist. This
 * improves code readability by separating the directive from subsequent imports
 * or code.
 *
 * @param sourceFile - The TypeScript source file to process
 *
 * @example
 * // Before:
 * 'use client'
 * import { useState } from 'react'
 *
 * // After:
 * 'use client'
 *
 * import { useState } from 'react'
 */
export const newLineAfterUseClient = (sourceFile: SourceFile) => {
  const firstStatement = sourceFile.getFirstChildByKind(SyntaxKind.ExpressionStatement)
  if (!firstStatement) return
  const firstExpr = firstStatement.getExpression()
  if (!Node.isStringLiteral(firstExpr)) return
  if (firstExpr.getLiteralText() !== 'use client') return

  const fullText = sourceFile.getFullText()
  const statementStart = firstStatement.getStart()
  const statementEnd = firstStatement.getEnd()

  const leading = fullText.slice(0, statementStart)
  const statementText = fullText.slice(statementStart, statementEnd)
  const trailing = fullText.slice(statementEnd)

  if (trailing.startsWith('\n\n')) return

  const newFullText = `${leading}${statementText}\n${trailing}`

  sourceFile.replaceWithText(newFullText)
}
