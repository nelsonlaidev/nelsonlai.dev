# @repo/mdx

MDX compilation for Vite using `@mdx-js/rollup`. This package owns the shared
Markdown plugins, heading IDs, table of contents, and
Shiki syntax highlighting. It does not manage content collections or routing.

```ts
import { mdx } from '@repo/mdx'
import { defineConfig } from 'vite'

export default defineConfig({ plugins: [mdx()] })
```

An MDX module exports a React component as its default export, plus `toc`.
The heading transform assigns IDs and builds the TOC in the same compiler pass.
Headings use GitHub-compatible IDs; TOC URLs contain the ID without a
leading `#`. The existing code highlighting, inline-code annotations, code block
titles, and CSP-compatible styles are preserved.

The web app's `content-collections.ts` owns frontmatter schemas, build-time
validation, locale and slug resolution. Its generated collections contain
metadata, not MDX source or executable code strings. Each document's `path`
matches the root-relative Vite glob key (`/content/blog/en/example.mdx`),
including nested slugs. Content Collections does not compile MDX.

The web renderer and article loader use the same document registry. The article
loader reads the TOC from the compiled module, without parsing Markdown again.
List and API requests import generated collections without loading document
bodies. Documents are eager on the server for complete SSR HTML and lazy chunks
in the browser. React Suspense boundaries belong to the web app.

The small Rollup wrapper only normalizes source maps for Vite 8's Rolldown
transform interface. It does not implement another compiler or import protocol.
Content is compiled during development or builds; production does not compile
MDX or read content files from the filesystem.
