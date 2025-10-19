import { consola } from 'consola'
import { execa } from 'execa'
import {
  type ArrowFunction,
  type FunctionDeclaration,
  type FunctionExpression,
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
    rewriteUIImports(sourceFile)
    rewriteCnImports(sourceFile)
    rewriteCvaImports(sourceFile)
    rewriteCvaArgs(sourceFile)
    rewriteDestructuredParams(sourceFile)
    rewriteSlotUses(sourceFile)
    separateTypeDefs(sourceFile)
    insert2aBeforeFunctions(sourceFile)
    formatCnClasses(sourceFile)
    formatCvaClasses(sourceFile)
    formatClasses(sourceFile)
    newLineAfterUseClient(sourceFile)
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
      imp.remove()
    } else {
      imp.replaceWithText(`import { ${[...used].join(', ')} } from 'react'`)
    }
  }
}

// Rewrite `import { Button } from '@/registry/new-york-v4/ui/button'` to `import { Button } from '@/components/ui/button'`
const rewriteUIImports = (sourceFile: SourceFile) => {
  for (const imp of sourceFile.getImportDeclarations()) {
    const mod = imp.getModuleSpecifierValue()
    const m = /^@\/registry\/new-york-v4\/ui\/([\w-]+)$/i.exec(mod)
    if (!m) continue

    const componentName = m[1]!
    imp.setModuleSpecifier(`@/components/ui/${componentName}`)
  }
}

// Rewrite `import { cn } from '@/lib/utils'` to `import { cn } from '@repo/ui/utils/cn'`
// Or `import { cn } from '@/registry/new-york-v4/lib/utils'` to `import { cn } from '@repo/ui/utils/cn'`
const rewriteCnImports = (sourceFile: SourceFile) => {
  for (const imp of sourceFile.getImportDeclarations()) {
    if (
      imp.getModuleSpecifierValue() !== '@/lib/utils' &&
      imp.getModuleSpecifierValue() !== '@/registry/new-york-v4/lib/utils'
    )
      continue

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

// Rewrite to use Slot.Root
const rewriteSlotUses = (sourceFile: SourceFile) => {
  const slotIdentifiers = sourceFile.getDescendantsOfKind(SyntaxKind.Identifier).filter((identifier) => {
    return identifier.getText() === 'Slot'
  })

  for (const identifier of slotIdentifiers) {
    const parent = identifier.getParent()

    if (parent.isKind(SyntaxKind.ImportSpecifier)) continue
    if (parent.isKind(SyntaxKind.PropertyAccessExpression) && parent.getExpression() === identifier) continue
    if (parent.isKind(SyntaxKind.VariableDeclaration) && parent.getNameNode() === identifier) continue

    identifier.replaceWithText('Slot.Root')
  }
}

// Insert `/// 2a` before all function declarations
const insert2aBeforeFunctions = (sourceFile: SourceFile) => {
  const fns = sourceFile.getFunctions()
  for (const fn of fns) {
    // Avoid double-inserting if already present
    const fullText = fn.getFullText()
    const leading = fullText.slice(0, fullText.indexOf(fn.getText()))
    if (/\/\/\/\s*2a\s*$/.test(leading)) continue

    fn.replaceWithText((writer) => {
      writer.writeLine('/// 2a')
      writer.write(fn.getText())
    })
  }
}

// Turn `({ ... }: Type)` into `(props: Type)` and add `const { ... } = props`.
const rewriteDestructuredParams = (sourceFile: SourceFile) => {
  // Function declarations
  for (const fn of sourceFile.getFunctions()) {
    fixDestructuring(fn)
  }

  for (const vs of sourceFile.getVariableStatements()) {
    for (const decl of vs.getDeclarations()) {
      const init = decl.getInitializer()
      if (!init) continue

      if (Node.isArrowFunction(init) || Node.isFunctionExpression(init)) {
        fixDestructuring(init)
      }
    }
  }
}

const fixDestructuring = (fn: FunctionDeclaration | FunctionExpression | ArrowFunction) => {
  const params = fn.getParameters()
  if (params.length !== 1) return

  const p = params[0]
  if (!p) return

  const nameNode = p.getNameNode()
  if (!Node.isObjectBindingPattern(nameNode)) return

  const body = fn.getBody()
  if (!body || !Node.isBlock(body)) return // skip expression bodies

  // Capture destructure text (with braces) before we change the param
  const destructText = nameNode.getText() // e.g. `{ className, ...props }`
  const originalParamType = p.getTypeNode()?.getText() ?? ''

  // Replace the original parameter with a simple `props` parameter
  p.replaceWithText(`props: ${originalParamType}`)

  if (destructText === '{ ...props }') return

  body.insertVariableStatement(0, {
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: destructText.replace(/\.{3}props/, '...rest'),
        initializer: 'props'
      }
    ]
  })

  fn.forEachDescendant((descendant) => {
    if (Node.isJsxSpreadAttribute(descendant)) {
      const expression = descendant.getExpression()
      if (Node.isIdentifier(expression) && expression.getText() === 'props') {
        expression.replaceWithText('rest')
      }
    }
  })
}

// const Component = (props: React.ComponentProps<typeof SomeOtherComponent>) => { ... }
// to
// type ComponentProps = React.ComponentProps<typeof SomeOtherComponent>
// const Component = (props: ComponentProps) => { ... }
const separateTypeDefs = (sourceFile: SourceFile) => {
  for (const fn of sourceFile.getFunctions()) {
    const params = fn.getParameters()
    if (params.length !== 1) continue

    const p = params[0]
    if (!p) continue

    const typeNode = p.getTypeNode()
    if (!typeNode) continue

    const paramName = p.getName()
    const paramType = typeNode.getText()

    if (paramName !== 'props' || !paramType.includes('React.')) return

    const functionName = fn.getName()
    const typeAliasName = `${functionName}Props`

    const insertionIndex = fn.getChildIndex()

    sourceFile.insertTypeAlias(insertionIndex, {
      name: typeAliasName,
      type: paramType
    })

    p.setType(typeAliasName)
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

      const newText = `[${groupedClasses}]`

      arg.replaceWithText(newText)
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
    const newText = `{cn([${groupedClasses}])}`
    initializer.replaceWithText(newText)
  }

  // Ensure `cn` is imported if used
  const hasCnImport = sourceFile.getImportDeclarations().some((imp) => {
    return (
      imp.getModuleSpecifierValue() === '@repo/ui/utils/cn' &&
      imp.getNamedImports().some((named) => named.getName() === 'cn')
    )
  })

  if (!hasCnImport) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: '@repo/ui/utils/cn',
      namedImports: ['cn']
    })
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

await main()
