import type { SourceFile } from 'ts-morph'

import dedent from 'dedent'
import * as prettier from 'prettier'
import { expect } from 'vitest'

import prettierConfig from '../../../../prettier.config'

import { createSourceFile } from './create-source-file'

export const expectTransformedEqual = async (
  received: string,
  expected: string,
  transformFn: (sourceFile: SourceFile) => void
) => {
  const sourceFile = createSourceFile(received)

  transformFn(sourceFile)

  const transformedText = await prettier.format(sourceFile.getFullText(), {
    parser: 'typescript',
    ...prettierConfig
  })

  expect(transformedText.replace(/\n$/, '')).toEqual(dedent(expected))
}
