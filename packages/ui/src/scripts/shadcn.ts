import { consola } from 'consola'
import { execa } from 'execa'
import { Project, QuoteKind } from 'ts-morph'

import { addDisplayNameToContexts } from './add-display-name-to-contexts'
import { formatClasses } from './format-classes'
import { formatCnClasses } from './format-cn-classes'
import { formatCvaClasses } from './format-cva-classes'
import { insert2aBeforeFunctions } from './insert-2a-before-functions'
import { newLineAfterUseClient } from './new-line-after-use-client'
import { rewriteCnImports } from './rewrite-cn-imports'
import { rewriteCvaArgs } from './rewrite-cva-args'
import { rewriteCvaImports } from './rewrite-cva-imports'
import { rewriteDestructuredParams } from './rewrite-destructured-params'
import { rewriteRadixImports } from './rewrite-radix-imports'
import { rewriteReactImports } from './rewrite-react-imports'
import { rewriteSlotUses } from './rewrite-slot-uses'
import { separateTypeDefs } from './separate-type-defs'

const main = async () => {
  const cliPaths = process.argv.slice(2)
  const paths = cliPaths.length > 0 ? cliPaths : ['src/components/**/*.{ts,tsx}']

  const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
    skipAddingFilesFromTsConfig: true,
    manipulationSettings: { quoteKind: QuoteKind.Single }
  })

  project.addSourceFilesAtPaths(paths)

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

  await execa('pnpm', ['prettier', '--write', ...paths], { stdio: 'inherit' })
  await execa('pnpm', ['eslint', '--fix', ...paths], { stdio: 'inherit' })
}

await main()
