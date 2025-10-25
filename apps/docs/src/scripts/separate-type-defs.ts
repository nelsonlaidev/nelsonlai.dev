import type { SourceFile } from 'ts-morph'

/**
 * Separates inline type definitions from function parameters into standalone type aliases.
 *
 * Transforms functions with inline type annotations on their `props` parameter into
 * functions with a separate type alias definition. This improves code readability and
 * makes type definitions reusable.
 *
 * @param sourceFile - The TypeScript source file to transform
 *
 * @example
 * // Before transformation:
 * const Component = (props: React.ComponentProps<typeof SomeOtherComponent>) => { ... }
 *
 * // After transformation:
 * type ComponentProps = React.ComponentProps<typeof SomeOtherComponent>
 * const Component = (props: ComponentProps) => { ... }
 */
export const separateTypeDefs = (sourceFile: SourceFile) => {
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
      typeText: `\n\ntype ${typeAliasName} = ${paramType}\n\n`,
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
