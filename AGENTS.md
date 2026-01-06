# AI Agent Guide for nelsonlai.dev

This document provides comprehensive guidance for OpenAI Codex and other AI agents working with the nelsonlai.dev codebase. It serves as a knowledge base to help AI understand our project structure, conventions, and requirements.

## Project Overview

nelsonlai.dev is a Next.js monorepo containing a personal website, and shared packages. The project uses TypeScript, React, and modern web development best practices.

## Project Structure for AI Navigation

```
nelsonlai-dev/
├── apps/                   # Application workspaces
│   ├── docs/               # Documentation site (Next.js)
│   └── web/                # Main website (Next.js)
├── packages/               # Shared packages
│   ├── db/                 # Database schema and migrations (Drizzle ORM)
│   ├── email/              # Email templates (React Email)
│   ├── env/                # Environment variable management
│   ├── i18n/               # Internationalization
│   ├── kv/                 # Key-value store utilities
│   └── ui/                 # Shared UI components library
```

### Key Directories AI Should Understand

- `apps/web/src`: Main website source code
  - `/app`: Next.js App Router pages and layouts
  - `/components`: React components
  - `/content`: MDX blog posts and static content
  - `/contexts`: React context providers
  - `/orpc`: oRPC routers and schemas
  - `/lib`: Core libraries
  - `/hooks`: Custom React hooks
  - `/utils`: Utility functions

- `packages/db/src`: Database layer
  - `/migrations`: Database migration files
  - `/schemas`: Drizzle ORM schema definitions

## Technology Stack

### Core Technologies

- Framework: Next.js 16+ with App Router
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS with custom utility classes
- Database: PostgreSQL with Drizzle ORM
- Cache: Redis for caching and rate limiting
- Authentication: Better Auth
- API: oRPC for type-safe APIs
- Email: React Email for transactional emails
- Testing: Playwright for E2E, Vitest for unit tests
- Package Manager: pnpm
- Monorepo: Turborepo

### Content Management

- MDX: For blog posts and documentation
- Content Collections: For structured content

## Coding Conventions for AI Agents

### TypeScript Guidelines

- Use function keywords for component functions and named functions
- Use arrow functions for anonymous callbacks and expressions
- Always use const unless reassignment is needed
- Avoid destructuring props directly in the parameter signature
- Avoid using interface for type definitions
- Avoid `any` types

### File Naming Conventions

- Files: kebab-case for everything (e.g., `use-debounce.ts`, `dropdown-menu.tsx`)
- Constants: UPPER_SNAKE_CASE in files (e.g., `API_ENDPOINT`)

### Component Structure

```tsx
// 1. Type definitions
type ComponentProps = {
  // ...
}

// 2. Component definition
function Component(props: ComponentProps) {
  const { className, ...rest } = props

  // 3. Hooks
  const [state, setState] = useState()

  // 4. Event handlers
  function handleClick() {
    // ...
  }

  // 5. Render
  return (
    <div className={className} {...rest}>
      {/* Content */}
    </div>
  )
}

// 6. Export
export default Component
```

### Styling Conventions

- Use Tailwind CSS utilities
- Use `cn()` helper from `@repo/ui/utils/cn` for conditional classes
- Use `gap-*` for flex/grid containers for consistent spacing
- Use margin utilities (`mt-*`, `mb-*`, etc.) for component-level spacing as needed
- Avoid inline styles unless dynamic
- Follow mobile-first responsive design

```tsx
// Good
<div className={cn('flex items-center gap-4', isActive && 'bg-accent')}>

// Avoid
<div style={{ display: 'flex', gap: '1rem' }}>
```

## Testing Requirements

### Running Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run unit tests
pnpm test:unit
```

### Test File Conventions

- Unit tests: `apps/web/src/tests/unit/**/*.test.ts[x]`
- E2E tests: `apps/web/src/tests/e2e/**/*.test.ts[x]`

### Writing Tests

```ts
// Unit test example
import { describe, test, expect } from 'vitest'

describe('<ComponentName />', () => {
  test('renders correctly', () => {
    // Test implementation
  })
})

// E2E test example
import { test, expect } from '@playwright/test'

test('page loads correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Nelson Lai/)
})
```

## Database Operations

### Schema Modifications

When modifying database schema:

1. Edit schema files in `packages/db/src/schemas/`
2. Generate migration: `pnpm db:generate`
3. Apply migration: `pnpm db:migrate`
4. Update types if needed

## API Development (oRPC)

### Creating New Routes

```ts
// In apps/web/src/orpc/routers/todo.router.ts
import { publicProcedure, protectedProcedure } from '../orpc'
import { todoOutputSchema, createTodoInputSchema } from '../schemas/todo.schema'

// Router files use noun-based naming: <noun>.router.ts (e.g., todo.router.ts, auth.router.ts)
// Individual procedures within routers use verb-noun format (e.g., listTodos, createTodo)
export const listTodos = publicProcedure.output(todoOutputSchema).handler(async ({ context }) => {
  // Implementation
})

export const createTodo = protectedProcedure
  .input(createTodoInputSchema)
  .output(todoOutputSchema)
  .handler(async ({ input, context }) => {
    // Implementation
  })
```

### Updating Main Router

```ts
// In apps/web/src/orpc/routers/index.ts
import { listTodos, createTodo } from './todo.router'

export const router = {
  todo: {
    list: listTodos,
    create: createTodo
  }
}
```

### Creating Reusable Query Hooks

```tsx
// In apps/web/src/hooks/queries/todo.query.ts
import { useQuery } from '@tanstack/react-query'
import { orpc } from '@/orpc/client'

export function useTodos() {
  return useQuery(orpc.todo.listTodos.queryOptions())
}
```

## Environment Variables

### Setup

1. Copy `.env.example` to `.env.local`
2. Fill in required variables (for testing, use fake values)
3. Use `packages/env` for type-safe access

## Pull Request Guidelines

### PR Title Format

Follow Conventional Commits:

- feat(scope): add new feature
- fix(scope): resolve issue
- docs(scope): update documentation
- style(scope): formatting changes
- refactor(scope): code improvements
- test(scope): add tests
- chore(scope): maintenance tasks

Available scopes:

- apps: docs, web
- packages: db, email, env, i18n, kv, ui

### PR Checklist

Before submitting:

1. Run `pnpm check` (includes lint, typecheck, format)
2. Run `pnpm test:unit && pnpm test:e2e` for affected packages
3. Add/update tests for new features
4. Ensure no console errors
5. Test on mobile viewport
6. Check accessibility (keyboard navigation, screen readers)

## Development Commands

### Essential Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev              # Run all apps and packages
pnpm dev:web          # Run web app only
pnpm dev:docs         # Run docs app only
pnpm dev:packages     # Run packages only

# Building
pnpm build            # Build all apps and packages
pnpm build:apps       # Build all apps
pnpm build:mdx        # Build MDX content

# Quality Checks
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format code with Prettier
pnpm format:check     # Check Prettier formatting
pnpm typecheck        # Run TypeScript checks
pnpm knip             # Check for unused stuff
pnpm check:i18n       # Check i18n translations
pnpm check            # Run all checks
pnpm clean            # Clean build artifacts

# Database
pnpm db:check         # Check database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Apply migrations
pnpm db:push          # Push database changes
pnpm db:reset         # Reset database
pnpm db:seed          # Seed database
pnpm db:studio        # Open Drizzle Studio

# Testing
pnpm test:e2e         # Run E2E tests
pnpm test:e2e:ui      # Run E2E tests with UI
pnpm test:e2e:inspector # Run E2E tests with inspector
pnpm test:e2e:install # Install Playwright browsers
pnpm test:unit        # Run unit tests
pnpm test:unit:watch  # Run unit tests in watch mode
pnpm test:unit:ui     # Run unit tests with UI
pnpm test:unit:coverage # Run unit tests with coverage

# Code Generation
pnpm typegen          # Generate types
```

## Common Patterns

### Data Fetching

```tsx
// Client Component with oRPC (preferred)
function ClientComponent() {
  const { data } = useTodos()
  return <div>{/* Render data */}</div>
}

// Server Component
async function ServerComponent() {
  const data = await db.select().from(table)
  return <div>{/* Render data */}</div>
}
```

### Error Handling

```ts
// Use error boundaries for UI errors
// Use oRPC error handling for API errors
import { ORPCError } from '@orpc/client'
// Log errors appropriately
```

### Performance Optimization

- Use Next.js Image component for images
- Implement proper loading states
- Use <Suspense /> for code splitting
- Optimize bundle size with dynamic imports (last resort)

## Accessibility Requirements

- All interactive elements must be keyboard accessible
- Use semantic HTML elements
- Provide proper ARIA labels where needed
- Ensure sufficient color contrast (WCAG AA)
- Test with screen readers

## Security Considerations

- Validate all user inputs (use Zod schemas)
- Sanitize data before rendering
- Use CSRF protection (built into Better Auth)
- Implement rate limiting for APIs
- Never expose sensitive data in client code

## Deployment

The project uses automated deployment:

- Main branch deploys to production
- Pull requests create preview deployments
- Environment variables are managed in deployment platform

## Getting Help

- Check existing issues before creating new ones
- Provide reproduction steps for bugs
- Include relevant error messages and logs
- Reference specific files and line numbers when applicable
