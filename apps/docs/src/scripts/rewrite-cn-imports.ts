import type { SourceFile } from 'ts-morph'

/**
 * Rewrites cn utility imports from shadcn's default path to the monorepo package path.
 *
 * This function transforms import statements for the `cn` utility function from the
 * shadcn-ui default location (`@/lib/utils`) to the monorepo's shared UI package
 * location (`@repo/ui/utils/cn`).
 *
 * @param sourceFile - The TypeScript source file to transform
 *
 * @example
 * // Before:
 * import { cn } from '@/lib/utils'
 *
 * // After:
 * import { cn } from '@repo/ui/utils/cn'
 */
export const rewriteCnImports = (sourceFile: SourceFile) => {
  for (const imp of sourceFile.getImportDeclarations()) {
    if (imp.getModuleSpecifierValue() !== '@/lib/utils') continue

    imp.replaceWithText(`import { cn } from '@repo/ui/utils/cn'`)
  }
}
