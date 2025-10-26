import type { SourceFile } from 'ts-morph'

/**
 * Rewrites CVA (Class Variance Authority) imports to use the shorter package name.
 *
 * This function transforms import statements for CVA utilities from the full package
 * name (`class-variance-authority`) to the shorter alias (`cva`). It preserves all
 * named imports from the original import statement.
 *
 * @param sourceFile - The TypeScript source file to transform
 *
 * @example
 * // Before:
 * import { cva, type VariantProps } from 'class-variance-authority'
 *
 * // After:
 * import { cva, type VariantProps } from 'cva'
 */
export const rewriteCvaImports = (sourceFile: SourceFile) => {
  for (const imp of sourceFile.getImportDeclarations()) {
    if (imp.getModuleSpecifierValue() !== 'class-variance-authority') continue

    const namedImports = imp
      .getNamedImports()
      .map((i) => i.getText())
      .join(', ')
    imp.replaceWithText(`import { ${namedImports} } from 'cva'`)
  }
}
