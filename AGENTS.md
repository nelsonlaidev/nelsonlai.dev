# Repository Guidelines

## Project Structure & Module Organization

This is a Bun-based Next.js 16 App Router project. Application code lives in `src/`, with routes in `src/app`, shared UI in `src/components`, content in `src/content`, database code in `src/db`, email templates in `src/emails`, and API routers/schemas in `src/orpc`. Tests live in `src/tests/unit` and `src/tests/e2e`. Static assets belong in `public/`. Generated output such as `.next/`, `coverage/`, `playwright-report/`, `test-results/`, and `.content-collections/generated/` should not be edited manually.

## Build, Test, and Development Commands

Use Bun for all local work.

- `bun dev`: start the app on `localhost:3000`
- `bun run build`: export Cosmos fixtures, then build production output
- `bun start`: run the production build locally
- `bun check`: run lint, typecheck, Prettier, Knip, i18n, and spellcheck
- `bun test:unit` or `bun test:unit:coverage`: run Vitest tests with optional coverage
- `bun test:e2e`: run Playwright end-to-end tests when the maintainer asks for them
- `bun db:migrate` and `bun db:seed`: prepare the local database
- `bun email:dev`: preview React Email templates on `localhost:3001`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Coding Style & Naming Conventions

TypeScript is strict; prefer small typed helpers over `any`. Follow ESLint and Prettier defaults via `eslint.config.ts` and `prettier.config.js`; run `bun lint:fix` and `bun format` before opening a PR. Use the `@/` alias for `src/` imports and `~/` for `public/`. Components use PascalCase exports, utility files use kebab-case names such as `get-pathnames.ts`, and tests end in `.test.ts` or `.test.tsx`.

## Testing Guidelines

Unit tests use Vitest with Testing Library and live under `src/tests/unit/**/*.test.{ts,tsx}`. E2E coverage uses Playwright under `src/tests/e2e`, with authenticated and unauthenticated flows split into separate folders. Add or update tests for behavior changes, and keep coverage focused on the touched area rather than broad snapshot churn. Run `bun test:unit` locally, but leave `bun test:e2e` to the maintainer unless explicitly requested.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commits such as `feat(analytics): ...`, `fix: ...`, and `docs(agents): ...`. Keep that prefix on the first line and do not add a commit body unless the maintainer explicitly asks for one. PRs should explain the user-visible change, call out env, schema, or content updates, link related issues, and include screenshots for UI or email template changes. Ensure `bun check` and `bun test:unit` pass before review; E2E runs are handled manually by the maintainer.

## Environment & Tooling Notes

Target `Node >= 24` and `bun >= 1.3`. Copy `.env.example` to `.env.local`, start services with `docker compose up -d`, and let `lefthook` format and lint staged files on commit.
