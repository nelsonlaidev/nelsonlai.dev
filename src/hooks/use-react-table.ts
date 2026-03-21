import type { TableOptions } from '@tanstack/react-table'

// oxlint-disable-next-line no-restricted-imports
import { useReactTable as _useReactTable } from '@tanstack/react-table'

// This wrapper fixes compatibility between TanStack Table v8 and the React Compiler.
// v8 uses "interior mutability" (stable references with changing internal state),
// which confuses the compiler's auto-memoization and can lead to a frozen UI.
// Using 'use no memo' ensures the table remains reactive until v9's native support.
// See: https://github.com/TanStack/table/issues/6137
// oxlint-disable-next-line react-x/no-unnecessary-use-prefix
export function useReactTable<TOptions>(options: TableOptions<TOptions>) {
  'use no memo'

  return _useReactTable(options)
}
