import { Node, type SourceFile, SyntaxKind } from 'ts-morph'

/**
 * Adds displayName property to React context variables created with createContext.
 * This helps with debugging in React DevTools by providing meaningful names for contexts.
 *
 * @param sourceFile - The TypeScript source file to transform
 *
 * @example
 * // Before transformation:
 * const MyContext = createContext(null)
 *
 * // After transformation:
 * const MyContext = createContext(null)
 * MyContext.displayName = 'MyContext'
 */
export const addDisplayNameToContexts = (sourceFile: SourceFile) => {
  const existingDisplayNames = getExistingDisplayNames(sourceFile)
  const variableStatements = sourceFile.getDescendantsOfKind(SyntaxKind.VariableStatement)

  for (const statement of variableStatements) {
    const declarations = statement.getDeclarations()

    for (const decl of declarations) {
      const initializer = decl.getInitializer()
      if (!initializer || !Node.isCallExpression(initializer)) continue

      const expr = initializer.getExpression()

      if (Node.isIdentifier(expr) && expr.getText() === 'createContext') {
        const contextName = decl.getName()

        // Skip if this context already has any displayName assignment
        if (existingDisplayNames.has(contextName)) continue

        const newStatement = `${contextName}.displayName = '${contextName}'`
        statement.replaceWithText(`${statement.getText()}\n${newStatement}`)
      }
    }
  }
}

/**
 * Collects all context names that already have displayName assignments in the source file.
 * This prevents duplicate displayName assignments.
 *
 * @param sourceFile - The TypeScript source file to scan
 * @returns A Set of context names that already have displayName assignments
 */
const getExistingDisplayNames = (sourceFile: SourceFile) => {
  const existingDisplayNames = new Set<string>()

  const expressionStatements = sourceFile.getDescendantsOfKind(SyntaxKind.ExpressionStatement)

  for (const statement of expressionStatements) {
    const text = statement.getText()
    // Match pattern: ContextName.displayName = '...'
    const match = /^(\w+)\.displayName\s*=/.exec(text)
    if (match?.[1]) {
      existingDisplayNames.add(match[1])
    }
  }

  return existingDisplayNames
}
