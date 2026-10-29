## Tests

Run commands from the repository root:

```sh
pnpm test:unit
pnpm test:unit:coverage
pnpm test:e2e:install
pnpm test:e2e
```

`test:e2e` starts dedicated Docker services and a production preview on port 3100.
PostgreSQL uses port 5433 and database `nelsonlaidev_test`; the Redis REST service
uses port 18079. Both ports bind to loopback. The services have temporary storage,
and test configuration overrides development database credentials and disables
email, Discord, analytics, and storage credentials. Database preparation refuses
any URL outside the dedicated test database.

To stop the services and discard their temporary data:

```sh
docker compose -f docker-compose.test.yaml -p nelsonlai-tests down
```

Unit watch, coverage, and UI commands are available as `test:unit:watch`,
`test:unit:coverage`, and `test:unit:ui`. Playwright offers `test:e2e:ui` and
`test:e2e:inspector`. Test reports, traces, screenshots, coverage, and signed
test-session storage states are ignored by Git.

### Migration coverage

The legacy E2E cases remain organized by authenticated and unauthenticated
behavior. They now use current RPC paths, Drizzle schema names and relational
filters, Cloudflare client identity, Paraglide messages, and accessible control
names. Repeated records and animated counters expose stable test identifiers.
Fixtures use the new database schema; teardown removes fixture-owned records
without flushing Redis.

The editor tests exercise the current controlled component with a stateful test
harness, preserving keyboard, selection, IME, undo/redo, formatting, and preview
coverage. Sitemap tests inspect the actual XML response instead of a Next.js
metadata function. The old pathname utility test is now `route-coverage.test.ts`;
the old IP helper test is now `utils/anonymous-key.test.ts`, which checks the
current trusted-header identity behavior. The hero assertion follows the current
introduction design rather than requiring the removed legacy image. The old
NextIntl rendering wrapper is unnecessary because current messages are compiled
by Paraglide.

The RPC tests preserve aborted-request handling, validation, and normal request
coverage through the TanStack route handler. No compatibility wrapper, dependency
injection, or Next.js dependency was added to production code for testing.

Accessibility checks preserve the legacy WCAG tag selection and its explicit
color-contrast exclusion; they are not a complete accessibility certification.
Test authentication uses locally seeded sessions rather than external OAuth.
Email delivery, R2 uploads, and external OAuth callbacks require separate
integration checks.

## Continuous integration

The GitHub Actions workflow runs on pull requests and pushes to `main`, using
Node.js 24 and the pnpm version declared by the workspace. Shared setup installs
the locked dependencies and generates environment modules for every package.
The checks job builds the workspace before checking formatting, lint, spelling,
types, unused code, translations, and unit tests, so generated content and
messages are available on a fresh checkout.

A separate job installs Chromium and its system dependencies, then runs E2E
tests against the dedicated Docker services. Both jobs use test-only environment
values without production secrets. Playwright reports and failure diagnostics
are retained for 30 days, and test services are stopped even after a failure.

Translation checks cover missing messages, variables, and syntax. The current
Inlang static analysis cannot fully trace dynamic imports and re-exports, so its
unused-message analysis is incomplete.
