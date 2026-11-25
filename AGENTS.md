# AGENTS.md

## Project

`nelsonlai.dev` is a personal blog and portfolio built with TanStack Start and
TypeScript.

## Development

- Before adding functionality, inspect the current implementation and reuse or
  extend existing code where practical.
- Validate changes with formatting, linting, type checking, and builds. Add
  automated tests only when explicitly requested.

## Code Style

- Follow the existing code style and nearby implementation patterns.
- Explain why a lint rule is disabled in a separate comment immediately above
  the disable directive. Omit the inline `--` description.
- Component functions must accept a named `props` parameter rather than
  destructuring props in the function signature. Destructure inside the function
  body when needed, following `apps/web/src/features/admin/admin-page-header.tsx`.
- When using a `render` prop, keep the element passed to it self-closing and
  place children on the component receiving the prop. For example:
  `<DialogTrigger render={<Button />}>Sign in</DialogTrigger>`.

## Database

- Follow the existing PostgreSQL and Drizzle setup for schema changes.
