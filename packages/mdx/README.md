# @repo/mdx

Shared Markdown plugins and table-of-contents extraction for Content Collections.
The package exports `remarkPlugins`, `rehypePlugins`, `getTOC`, and the `TOC` type.

The web app compiles MDX during Content Collections transforms with
`@content-collections/mdx`. The renderer uses its official `useMDXComponent` hook.
Production does not compile MDX or read content files from the filesystem.

The heading plugin assigns GitHub-compatible IDs. `getTOC` uses the same MDX
parser and heading plugin, including formatted headings and duplicate IDs, and
returns URLs without a leading `#`. Content Collections caches compiled code and
TOCs. List and API responses select metadata without sending document bodies.

Shiki uses the unmodified `vitesse-dark` theme for all MDX code blocks and
inline-code annotations. Code block titles and notation transforms are preserved.
Its generated inline styles are allowed by the web app's CSP. Compilation resolves
imports relative to each document's directory.

Only repository-owned content is compiled as MDX. User comments use the separate
Markdown renderer with raw HTML parsing disabled. MDX code is executable and must
never be compiled from untrusted user content.
