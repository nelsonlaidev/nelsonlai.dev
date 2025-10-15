# AI Agent Guide for nelsonlai.dev

This document provides comprehensive guidance for OpenAI Codex and other AI agents working with the nelsonlai.dev codebase. It serves as a knowledge base to help AI understand our project structure, conventions, and requirements.

## Project Overview

nelsonlai.dev is a Next.js monorepo containing a personal website, and shared packages. The project uses TypeScript, React, and modern web development best practices.

## Project Structure for AI Navigation

```
nelsonlai-dev/
├── apps/                   # Application workspaces
│   └── web/                # Main website (Next.js)
├── packages/               # Shared packages
│   ├── db/                 # Database schema and migrations (Drizzle ORM)
│   ├── email/              # Email templates (React Email)
│   ├── env/                # Environment variable management
│   ├── i18n/               # Internationalization
│   ├── kv/                 # Key-value store utilities
│   ├── ui/                 # Shared UI components library
│   ├── utils/              # Common utility functions
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
  - `/stores`: State management (Zustand)
  - `/utils`: Utility functions

- `packages/db/src`: Database layer
  - `/migrations`: Database migration files
  - `/schemas`: Drizzle ORM schema definitions

## Technology Stack

### Core Technologies

- Framework: Next.js 15+ with App Router
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

- Always use arrow functions
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
const Component = (props: ComponentProps) => {
  const { className, ...rest } = props

  // 3. Hooks
  const [state, setState] = useState()

  // 4. Event handlers
  const handleClick = () => {
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
- Prefer `space-x-*` and `space-y-*` over `mb-*` and `mt-*`
- Prefer `gap-*` over `space-x-*` and `space-y-*` in flex containers
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
// In apps/web/src/orpc/routers/todo.route.ts
import * as z from 'zod'
import { publicProcedure, protectedProcedure } from '../root'

// Router name convention: use verb-noun format
// e.g., get-user, create-post, update-profile
export const listTodos = publicProcedure.output(todoSchema).handler(async ({ context }) => {
  // Implementation
})

export const createTodo = protectedProcedure
  .input(createTodoInputSchema)
  .output(todoSchema)
  .handler(async ({ input, context }) => {
    // Implementation
  })
```

### Updating Main Router

```ts
// In apps/web/src/orpc/routers/index.ts

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

export const useTodos = () => {
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

- apps: web
- packages: db, email, env, i18n, kv, ui, utils

### PR Checklist

Before submitting:

1. Run `pnpm check` (includes lint, type-check, format)
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

# Building
pnpm build        # Build all apps and packages
pnpm build:apps       # Build all apps
pnpm build:mdx        # Build MDX content

# Quality Checks
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format:check     # Check Prettier formatting
pnpm format:fix       # Fix formatting
pnpm type-check       # Run TypeScript checks
pnpm check:knip       # Check for unused stuff
pnpm check:spelling   # Check spelling
pnpm check            # Run all checks

# Database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Apply migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Drizzle Studio

# Testing
pnpm test:e2e         # Run E2E tests
pnpm test:unit        # Run unit tests
```

## Common Patterns

### Data Fetching

```tsx
// Client Component with oRPC (preferred)
const ClientComponent = () => {
  const { data } = useTodos()
  return <div>{/* Render data */}</div>
}

// Server Component
const ServerComponent = async () => {
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
