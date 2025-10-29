import dedent from 'dedent'
import { IndentationText, Project, QuoteKind } from 'ts-morph'

export const createSourceFile = (code: string) => {
  const project = new Project({
    useInMemoryFileSystem: true,
    manipulationSettings: {
      quoteKind: QuoteKind.Single,
      indentationText: IndentationText.TwoSpaces
    }
  })
  return project.createSourceFile('test.tsx', dedent(code))
}
