import { consola } from 'consola'
import { execa } from 'execa'
import {
  type ArrowFunction,
  type Expression,
  type FunctionDeclaration,
  Node,
  Project,
  QuoteKind,
  type SourceFile,
  SyntaxKind,
  VariableDeclarationKind
} from 'ts-morph'

import { groupClasses } from './group-classes'

const toPascal = (kebab: string) =>
  kebab
    .split(/[-_]/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')

const main = async () => {
  const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
    skipAddingFilesFromTsConfig: true,
    manipulationSettings: { quoteKind: QuoteKind.Single }
  })

  project.addSourceFilesAtPaths(['src/components/ui/**/*.{ts,tsx}'])

  for (const sourceFile of project.getSourceFiles()) {
    rewriteRadixImports(sourceFile)
    rewriteReactImports(sourceFile)
    rewriteCnImports(sourceFile)
    rewriteCvaImports(sourceFile)
    rewriteCvaArgs(sourceFile)
    rewriteDestructuredParams(sourceFile)
    rewriteSlotUses(sourceFile)
    insert2aBeforeFunctions(sourceFile)
    separateTypeDefs(sourceFile)
    formatCnClasses(sourceFile)
    formatCvaClasses(sourceFile)
    formatClasses(sourceFile)
    newLineAfterUseClient(sourceFile)
    addDisplayNameToContexts(sourceFile)
  }

  await project.save()

  consola.log('Transformed shadcn-ui components.')

  await execa('pnpm', ['prettier', '--write', 'src/components/ui/**/*.{ts,tsx}'], { stdio: 'inherit' })
  await execa('pnpm', ['eslint', '--fix', 'src/components/ui/**/*.{ts,tsx}'], { stdio: 'inherit' })
}

// @radix-ui/react-x -> radix-ui, with proper named import alias
const rewriteRadixImports = (sourceFile: SourceFile) => {
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

// Replace `import * as React` with only used functions
const rewriteReactImports = (sourceFile: SourceFile) => {
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

// Rewrite `import { cn } from '@/lib/utils'` to `import { cn } from '@repo/ui/utils/cn'`
const rewriteCnImports = (sourceFile: SourceFile) => {
  for (const imp of sourceFile.getImportDeclarations()) {
    if (imp.getModuleSpecifierValue() !== '@/lib/utils') continue

    imp.replaceWithText(`import { cn } from '@repo/ui/utils/cn'`)
  }
}

// Rewrite `import { cva } from 'class-variance-authority'` to `import { cva } from 'cva'`
const rewriteCvaImports = (sourceFile: SourceFile) => {
  for (const imp of sourceFile.getImportDeclarations()) {
    if (imp.getModuleSpecifierValue() !== 'class-variance-authority') continue

    const namedImports = imp
      .getNamedImports()
      .map((i) => i.getText())
      .join(', ')
    imp.replaceWithText(`import { ${namedImports} } from 'cva'`)
  }
}

// Rewrite to use the beta `cva` API
const rewriteCvaArgs = (sourceFile: SourceFile) => {
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

// Turn `({ ... }: Type)` into `(props: Type)` and add `const { ... } = props`.
const rewriteDestructuredParams = (sourceFile: SourceFile) => {
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

// Rewrite to use Slot.Root
const rewriteSlotUses = (sourceFile: SourceFile) => {
  const slotIdentifiers = sourceFile.getDescendantsOfKind(SyntaxKind.Identifier).filter((identifier) => {
    return identifier.getText() === 'Slot'
  })

  for (const identifier of slotIdentifiers) {
    const parent = identifier.getParent()

    if (Node.isImportSpecifier(parent)) continue
    if (Node.isPropertyAccessExpression(parent) && parent.getExpression() === identifier) continue
    if (Node.isVariableDeclaration(parent) && parent.getNameNode() === identifier) continue
    if (parent.getText() === 'Slot.Root') continue

    identifier.replaceWithText('Slot.Root')
  }
}

// Insert `/// 2a` before all function declarations
const insert2aBeforeFunctions = (sourceFile: SourceFile) => {
  const fns = sourceFile.getFunctions()
  for (const fn of fns) {
    const fullText = fn.getFullText()
    const leading = fullText.slice(0, fullText.indexOf(fn.getText()))
    if (/\/\/\/\s*2a\s*$/.test(leading)) continue

    fn.replaceWithText((writer) => {
      writer.writeLine('/// 2a')
      writer.write(fn.getText())
    })
  }
}

// const Component = (props: React.ComponentProps<typeof SomeOtherComponent>) => { ... }
// to
// type ComponentProps = React.ComponentProps<typeof SomeOtherComponent>
// const Component = (props: ComponentProps) => { ... }
const separateTypeDefs = (sourceFile: SourceFile) => {
  const modifications = []

  for (const fn of sourceFile.getFunctions()) {
    const params = fn.getParameters()
    if (params.length !== 1) continue

    const p = params[0]
    if (!p) continue

    const typeNode = p.getTypeNode()
    if (!typeNode) continue

    const paramName = p.getName()
    const paramType = typeNode.getText()
    const functionName = fn.getName()
    const typeAliasName = `${functionName}Props`

    if (paramName !== 'props' || paramType === typeAliasName) continue

    modifications.push({
      insertPos: fn.getFullStart(),
      typeText: `\n\ntype ${typeAliasName} = ${paramType}`,
      replaceStart: typeNode.getStart(),
      replaceEnd: typeNode.getEnd(),
      typeAliasName
    })
  }

  modifications.sort((a, b) => b.insertPos - a.insertPos)

  for (const mod of modifications) {
    sourceFile.replaceText([mod.replaceStart, mod.replaceEnd], mod.typeAliasName)
    sourceFile.insertText(mod.insertPos, mod.typeText)
  }
}

// Format the classes inside `cn(...)` calls
// by grouping them
const formatCnClasses = (sourceFile: SourceFile) => {
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

// Same as formatCnClasses but for `cva({ base: '...' })` strings
const formatCvaClasses = (sourceFile: SourceFile) => {
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

// Same as formatCnClasses but for bare className strings
const formatClasses = (sourceFile: SourceFile) => {
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
    const groupedJoined = grouped.join(' ')
    if (groupedJoined === raw.trim()) continue

    const groupedClasses = grouped.map((c) => `"${c}"`).join(', ')
    const newText = `{cn(${groupedClasses})}`
    initializer.replaceWithText(newText)
  }
}

// Ensure a new line after 'use client' directive
const newLineAfterUseClient = (sourceFile: SourceFile) => {
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

// Ensure contexts have displayName set
const addDisplayNameToContexts = (sourceFile: SourceFile) => {
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
        const newStatement = `${contextName}.displayName = '${contextName}'`

        if (existingDisplayNames.has(newStatement)) continue

        statement.replaceWithText(`${statement.getText()}\n${newStatement}`)
      }
    }
  }
}

const getExistingDisplayNames = (sourceFile: SourceFile) => {
  const existingDisplayNames = new Set<string>()

  const expressionStatements = sourceFile.getDescendantsOfKind(SyntaxKind.ExpressionStatement)

  for (const statement of expressionStatements) {
    if (statement.getText().includes('.displayName')) {
      existingDisplayNames.add(statement.getText())
    }
  }

  return existingDisplayNames
}

await main()
