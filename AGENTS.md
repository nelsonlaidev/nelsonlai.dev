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
- Leave `apps/web/scripts/check-ssr.ts` unchanged during the migration; no further
  modifications to this script are needed.

## Code Style

- Follow the existing code style and nearby implementation patterns.
- Component functions must accept a named `props` parameter rather than
  destructuring props in the function signature. Destructure inside the function
  body when needed, following `apps/web/src/components/page-header.tsx`.

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
