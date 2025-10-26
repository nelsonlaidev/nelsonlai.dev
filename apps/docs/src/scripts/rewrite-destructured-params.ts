import { consola } from 'consola'
import {
  type ArrowFunction,
  type Expression,
  type FunctionDeclaration,
  Node,
  type SourceFile,
  SyntaxKind,
  VariableDeclarationKind
} from 'ts-morph'

/**
 * Rewrites destructured function parameters to use a props object pattern.
 *
 * This function transforms React component functions that use destructured parameters
 * in their signature to instead accept a single `props` parameter, with the destructuring
 * moved into the function body. This follows a more explicit coding style where the props
 * object is clearly visible in the function signature.
 *
 * Additionally, it renames spread `{...props}` to `{...rest}` in JSX spread attributes
 * to avoid naming conflicts.
 *
 * @param sourceFile - The TypeScript source file to transform
 *
 * @example
 * // Before:
 * function Button({ className, children, ...props }: ButtonProps) {
 *   return <button className={className} {...props}>{children}</button>
 * }
 *
 * // After:
 * function Button(props: ButtonProps) {
 *   const { className, children, ...rest } = props
 *   return <button className={className} {...rest}>{children}</button>
 * }
 */
export const rewriteDestructuredParams = (sourceFile: SourceFile) => {
  const componentFunctions = getComponentFunctions(sourceFile)

  for (const fn of componentFunctions) {
    const params = fn.getParameters()
    if (params.length !== 1) continue

    const p = params[0]
    if (!p) continue

    const nameNode = p.getNameNode()
    if (!Node.isObjectBindingPattern(nameNode)) continue // skip non-destructured params

    const body = fn.getBody()
    if (!body || !Node.isBlock(body)) continue // skip expression bodies

    // Capture destructure text (with braces) before we change the param
    const destructText = nameNode.getText() // e.g. `{ className, ...props }`
    const originalParamType = p.getTypeNode()?.getText() ?? ''

    // Replace the original parameter with a simple `props` parameter
    p.replaceWithText(`props: ${originalParamType}`)

    if (destructText === '{ ...props }') continue

    body.insertVariableStatement(0, {
      declarationKind: VariableDeclarationKind.Const,
      declarations: [
        {
          name: destructText.replace(/\.{3}props/, '...rest'),
          initializer: 'props'
        }
      ]
    })

    let modifiedSpreadExpressionCount = 0

    fn.forEachDescendant((descendant) => {
      if (Node.isJsxSpreadAttribute(descendant)) {
        const expression = descendant.getExpression()
        if (Node.isIdentifier(expression) && expression.getText() === 'props') {
          expression.replaceWithText('rest')
          modifiedSpreadExpressionCount++
        }
      }
    })

    if (modifiedSpreadExpressionCount > 1) {
      consola.warn(`Warning: Modified ${modifiedSpreadExpressionCount} spread attributes in ${fn.getText()}`)
    }
  }
}

const getComponentFunctions = (sourceFile: SourceFile) => {
  const jsxFunctions: Array<FunctionDeclaration | ArrowFunction> = []

  const functionDeclarations: FunctionDeclaration[] = sourceFile.getFunctions()

  for (const funcDecl of functionDeclarations) {
    if (isReturningJsx(funcDecl)) {
      jsxFunctions.push(funcDecl)
    }
  }

  return jsxFunctions
}

const unwrapParentheses = (expr: Expression | undefined): Expression | undefined => {
  while (expr && Node.isParenthesizedExpression(expr)) {
    expr = expr.getExpression()
  }
  return expr
}

const isReturningJsx = (node: FunctionDeclaration | ArrowFunction): boolean => {
  const body = node.getBody()

  // If the body is a block, check all return statements
  if (!Node.isBlock(body)) return true

  const returnStatements = body.getDescendantsOfKind(SyntaxKind.ReturnStatement)

  for (const returnStatement of returnStatements) {
    const returnExpression = returnStatement.getExpression()
    const unwrappedExpression = unwrapParentheses(returnExpression)

    if (
      Node.isJsxElement(unwrappedExpression) ||
      Node.isJsxSelfClosingElement(unwrappedExpression) ||
      Node.isJsxFragment(unwrappedExpression)
    ) {
      return true
    }
  }

  return false
}
