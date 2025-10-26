import type { SourceFile } from 'ts-morph'

/**
 * Inserts a `/// 2a` comment before all function declarations in a source file.
 *
 * This function scans through all function declarations in the provided source file
 * and adds a `/// 2a` comment line immediately before each function, unless the
 * comment already exists.
 *
 * @param sourceFile - The TypeScript source file to transform
 *
 * @example
 * ```ts
 * // Before:
 * function myFunction() {
 *   return 'hello'
 * }
 *
 * // After:
 * /// 2a
 * function myFunction() {
 *   return 'hello'
 * }
 * ```
 */
export const insert2aBeforeFunctions = (sourceFile: SourceFile) => {
  const fileText = sourceFile.getFullText()

  const insertions = sourceFile
    .getFunctions()
    .map((fn) => {
      const start = fn.getStart()
      const ranges = fn.getLeadingCommentRanges()
      const last = ranges.length > 0 ? ranges.at(-1) : undefined
      const lastText = last ? fileText.slice(last.getPos(), last.getEnd()).trim() : null

      if (lastText && /^\/\/\/\s*2a$/.test(lastText)) return null

      const lineStart = fileText.lastIndexOf('\n', start - 1) + 1
      const indent = (/^\s*/.exec(fileText.slice(lineStart, start)) ?? [''])[0]

      return { pos: start, text: `${indent}/// 2a\n` }
    })
    .filter((x): x is { pos: number; text: string } => !!x)

  for (const { pos, text } of insertions.toSorted((a, b) => b.pos - a.pos)) {
    sourceFile.insertText(pos, text)
  }
}
