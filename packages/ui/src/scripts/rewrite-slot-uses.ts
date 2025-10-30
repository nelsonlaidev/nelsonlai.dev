import { Node, type SourceFile, SyntaxKind } from 'ts-morph'

/**
 * Rewrites all `Slot` identifier usages to `Slot.Root` in a source file.
 *
 * This function finds all occurrences of the `Slot` identifier and replaces them
 * with `Slot.Root`, except in the following cases:
 * - Import specifiers (e.g., `import { Slot } from '@radix-ui/react-slot'`)
 * - Property access expressions where `Slot` is the object (e.g., `Slot.Root`)
 * - Variable declarations where `Slot` is the variable name (e.g., `const Slot = ...`)
 * - Already transformed usages (e.g., `Slot.Root`)
 *
 * @param sourceFile - The TypeScript source file to transform
 *
 * @example
 * // Before transformation:
 * import { Slot } from '@radix-ui/react-slot'
 * const Component = () => <Slot>content</Slot>
 *
 * // After transformation:
 * import { Slot } from '@radix-ui/react-slot'
 * const Component = () => <Slot.Root>content</Slot.Root>
 */
export const rewriteSlotUses = (sourceFile: SourceFile) => {
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
