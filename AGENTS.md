# AGENTS.md

## Project Goal

Migrate the existing `nelsonlai.dev` website from `../nelsonlai.dev` into this
codebase, which uses TanStack Start.

- Use the legacy project as the reference for existing features, content, and
  behavior when implementing migration work.
- Adapt implementations to the current codebase's architecture and conventions.
- Before adding functionality, inspect the current implementation and reuse or
  extend existing code where practical.
- The legacy checkout may not be at the same relative path when working in a Git
  worktree. Locate the original checkout before inspecting legacy code.
- Validate changes with formatting, linting, type checking, and builds. Add
  automated tests only when explicitly requested.

## Migration Fidelity

- Migration means preserving the legacy website's appearance, content, behavior,
  and component capabilities while adapting framework-specific integration to
  TanStack Start and this repository's architecture.
- Before migrating a component, inspect its legacy implementation, underlying UI
  primitives, hooks, styles, assets, and call sites. Reuse the original
  implementation and dependencies when compatible.
- Do not replace existing library-backed components with simplified custom
  implementations or omit features to make the page render. Preserve animations,
  keyboard navigation, focus management, accessibility, responsive layouts,
  loading and error states, and supported props.
- Improvements must preserve existing capabilities. Explain any necessary
  replacement and verify equivalent behavior; obtain explicit user approval for
  intentional feature removals or redesigns.
- Before declaring a migration complete, compare the migrated component against
  the legacy version visually and interactively, including mobile layouts and
  relevant states. Formatting, linting, type checking, and builds alone do not
  establish migration fidelity. Report any unverified behavior or remaining gaps.

## Code Style

- Follow the existing code style and nearby implementation patterns.
- Component functions must accept a named `props` parameter rather than
  destructuring props in the function signature. Destructure inside the function
  body when needed, following `apps/web/src/components/page-header.tsx`.
- When using a `render` prop, keep the element passed to it self-closing and
  place children on the component receiving the prop. For example:
  `<DialogTrigger render={<Button />}>Sign in</DialogTrigger>`.

## Improvements During Migration

- Proactively make improvements discovered during migration, including variable
  and function names, other naming, code structure, performance, database
  queries, and any other opportunities to improve the codebase.
- Apply these improvements directly without asking for approval first, while
  respecting the explicit constraints in this document.
- After completing the work, summarize the improvements made and explain what
  changed and why.

## Deployment

- Deploy the application in Docker containers to the owner's VPS using Dokploy.
- Keep deployment work aligned with this Docker and Dokploy setup.
- Inspect the existing Docker Compose configuration before adding infrastructure
  configuration; it currently defines supporting services, not the application
  container.

## Database and Data Migration

- Use a new database for this application, separate from the legacy database.
- Follow the existing PostgreSQL and Drizzle setup for schema changes.
- Migrate the legacy data manually because the dataset is small.
- Treat schema migrations for the new database separately from transferring
  legacy records.
- Do not build automated legacy data migration or ongoing synchronization unless
  explicitly requested.
