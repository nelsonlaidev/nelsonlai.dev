<div align="center">
  <a href="https://nelsonlai.dev">
    <img alt="Homepage of nelsonlai.dev" src=".github/images/header.png">
  </a>

  <h1 align="center">
    nelsonlai.dev
  </h1>

  <img src="https://img.shields.io/badge/TanStack_Start-000000.svg?style=for-the-badge&logo=tanstack&labelColor=000" alt="Framework" />
  <img src="https://img.shields.io/github/languages/top/nelsonlaidev/nelsonlai.dev?style=for-the-badge&labelColor=000" alt="Language" />
  <img src="https://img.shields.io/github/license/nelsonlaidev/nelsonlai.dev?style=for-the-badge&labelColor=000" alt="License" />
</div>

This is my personal blog and portfolio, built with TanStack Start. I publish articles in MDX and share my projects here.

## Features

### Core Technologies

- TanStack Start with file-based routing, Vite, and Nitro
- React 19 with React Compiler
- TypeScript with strict configuration
- Tailwind CSS v4 for styling
- MDX for content (Content Collections)
- PostgreSQL with Drizzle ORM
- Paraglide JS for internationalization
- oRPC and TanStack Query for type-safe data fetching

### UI/UX

- Base UI for accessible UI components
- Responsive design
- Image zoom in blog posts
- Shiki for code syntax highlighting
- Motion for animations
- Table of contents for blog posts

### Site Features

- Guestbook
- Admin dashboard for managing users and comments
- Account settings

### Blog Features

- Comment system
- Like functionality
- Post view counter
- Blog post search
- RSS feed
- Sitemap

### Performance & SEO

- Localized metadata, canonical URLs, and JSON-LD
- Dynamic Open Graph images rendered with Takumi

### Development Experience

- pnpm workspaces and Turborepo for builds and development tasks
- Storybook for shared UI components
- Vitest for unit testing
- Playwright for E2E testing
- Oxlint configuration
- Oxfmt code formatting
- Knip for unused code detection
- CSpell for spell checking
- inlang CLI for translation checks
- Lefthook for Git hooks
- Conventional Commits
- GitHub Actions CI

### Authentication & Data

- Better Auth
- Redis caching with Upstash
- Upstash for API rate limiting
- Varlock for environment validation and typed access
- Umami Analytics
- Cloudflare R2 for image storage
- Resend for transactional emails

### Email Templates

#### Comment Notification

<div align="center">
  <img alt="Comment notification template" src=".github/images/comment-notification-email.png" width="660">
</div>

#### Reply Notification

<div align="center">
  <img alt="Reply notification template" src=".github/images/reply-notification-email.png" width="660">
</div>

## Getting Started

### Prerequisites

- Node.js 24 or later
- pnpm >=12, as pinned in `package.json`
- Docker with Docker Compose
- Optional editor tools include [Visual Studio Code](https://code.visualstudio.com/) with the [recommended extensions](.vscode/extensions.json) and [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en).

## Project Structure

| Workspace                                      | Contents                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------------------- |
| [apps/web](apps/web/README.md)                 | TanStack Start application, MDX content, translations, static assets, and tests |
| [apps/storybook](apps/storybook/README.md)     | Component stories and Storybook configuration                                   |
| [packages/api](packages/api/README.md)         | oRPC procedures and request context                                             |
| [packages/auth](packages/auth/README.md)       | Better Auth server configuration and browser client                             |
| [packages/db](packages/db/README.md)           | Drizzle schema, relations, migrations, and seed data                            |
| [packages/email](packages/email/README.md)     | React Email templates and delivery                                              |
| [packages/kv](packages/kv/README.md)           | Redis caching and rate limiting                                                 |
| [packages/mdx](packages/mdx/README.md)         | Heading and code highlighting plugins for MDX                                   |
| [packages/scripts](packages/scripts/README.md) | README image generation                                                         |
| [packages/ui](packages/ui/README.md)           | Shared React components, theme, and typography                                  |
| [packages/utils](packages/utils/README.md)     | Index range and Unicode name helpers                                            |

The [workspace manifest](pnpm-workspace.yaml) lists workspace members and shared dependency versions. The [root scripts](package.json) and [Turborepo configuration](turbo.json) define commands, task dependencies, and caching. Local services are defined in [Docker Compose](docker-compose.yaml).

CI workflows, shared actions, and README images live under [.github](.github). Editor settings and extension recommendations live under [.vscode](.vscode).

## Development

Run the following commands from the repository root after cloning.

### Setup

1. Clone the repository and enter the checkout.

   ```bash
   git clone https://github.com/nelsonlaidev/nelsonlai.dev.git
   cd nelsonlai.dev
   ```

2. Install workspace dependencies.

   ```bash
   pnpm install --frozen-lockfile
   ```

### Environment Setup

1. Create `apps/web/.env.local` with the following local settings. Run `openssl rand -hex 32` three times and paste a different generated value into each empty secret field. Keep `IP_ADDRESS_SALT` stable to preserve anonymous post-like identifiers.

   ```dotenv
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/nelsonlaidev
   UPSTASH_REDIS_REST_URL=http://localhost:8079
   UPSTASH_REDIS_REST_TOKEN=local-uprest-token-7f3c9a2e6b1d4f80
   IP_ADDRESS_SALT=
   BETTER_AUTH_SECRET=
   JWT_SECRET=
   RESEND_FROM_EMAIL="Local Development <noreply@example.invalid>"
   ```

   The web app, workspace tooling, and shared packages use the same local settings. The schema lists optional integrations and defaults, including the local site URL. See the [web environment schema](apps/web/.env.schema).

2. Validate the configuration and generate the typed environment modules used by the database scripts.

   ```bash
   pnpm env:check
   pnpm env:generate
   ```

3. Start the local services, apply the database migrations, and seed the post records from the MDX content.

   ```bash
   docker compose up -d --wait
   pnpm db:migrate
   pnpm db:seed
   ```

4. Start the web app.

   ```bash
   pnpm dev
   ```

   Open [localhost:3000](http://localhost:3000). To preview email templates or browse component stories, run `pnpm email:dev` or `pnpm storybook` in a separate terminal.

| Service        | Local address    |
| -------------- | ---------------- |
| Web app        | `localhost:3000` |
| React Email    | `localhost:3001` |
| Storybook      | `localhost:6006` |
| PostgreSQL     | `localhost:5432` |
| Redis          | `localhost:6379` |
| Redis REST API | `localhost:8079` |

### Available Scripts

```bash
# Development and builds
pnpm dev                        # Start the web development server
pnpm build                      # Build the workspace for production
pnpm --filter @repo/web preview # Preview the built web app
pnpm storybook                  # Browse shared UI components
pnpm storybook:build            # Build the static Storybook site
pnpm email:dev                  # Preview email templates
pnpm email:export               # Export email templates
pnpm readme:images              # Refresh the README cover and email screenshots

# Configuration and quality checks
pnpm env:check                  # Validate environment variables
pnpm env:generate               # Generate typed environment modules
pnpm format                     # Format code with Oxfmt
pnpm format:check               # Check formatting
pnpm lint                       # Run Oxlint
pnpm lint:fix                   # Apply lint fixes
pnpm spellcheck                 # Check spelling
pnpm typecheck                  # Check TypeScript types
pnpm knip                       # Find unused code and dependencies
pnpm i18n:check                 # Validate translations

# Tests
pnpm test:unit                  # Run workspace unit tests
pnpm test:unit:coverage         # Run web unit tests with coverage
pnpm test:e2e:install           # Install Chromium for Playwright
pnpm test:e2e                   # Run end-to-end tests against a local preview

# Database
pnpm db:generate                # Generate migrations from schema changes
pnpm db:migrate                 # Apply pending migrations
pnpm db:seed                    # Insert missing blog post records
pnpm db:push                    # Push schema changes directly to the database
pnpm db:reset                   # Reset the database
pnpm db:studio                  # Open Drizzle Studio
```

## Credits

This project has been made possible thanks to the wonderful open-source community. Special thanks to:

- [Timothy](https://www.timlrx.com/) for the [Tailwind nextjs starter blog template](https://github.com/timlrx/tailwind-nextjs-starter-blog).
- [Eihab](https://www.eihabkhan.com/) for the UI design inspiration ([Figma](https://www.figma.com/community/file/1266863403759514317/geist-ui-kit-for-figma))

This project also uses/adapts the following open-source projects:

- Comment System - from [fuma-comment](https://github.com/fuma-nama/fuma-comment)
- Rehype Plugins - from [fumadocs](https://github.com/fuma-nama/fumadocs)
- UI components - from [shadcn/ui](https://github.com/shadcn-ui/ui)
- Admin UI - from [shadcn-admin](https://github.com/satnaing/shadcn-admin)

The following projects were referenced for inspiration:

- [fumadocs](https://fumadocs.vercel.app/)
- [leerob.io](https://leerob.io/)
- [nerdfish.be](https://www.nerdfish.be/)
- [nextra.site](https://nextra.site/)
- [theodorusclarence.com](https://theodorusclarence.com/)
- [ped.ro](https://ped.ro/)
- [delba.dev](https://delba.dev/)
- [joshwcomeau.com](https://www.joshwcomeau.com/)
- [blog.maximeheckel.com](https://blog.maximeheckel.com/)
- [zenorocha.com](https://zenorocha.com/)
- [jahir.dev](https://jahir.dev/)
- [anishde.dev](https://anishde.dev/)
- [nikolovlazar.com](https://nikolovlazar.com/)
- [samuelkraft.com](https://samuelkraft.com/)
- [bentogrids.com](https://bentogrids.com/)
- [ui.aceternity.com](https://ui.aceternity.com/)
- [hover.dev](https://www.hover.dev/)
- [vocs.dev](https://vocs.dev/)

## Author

- [@nelsonlaidev](https://github.com/nelsonlaidev)

## Donation

If you find this project helpful, consider supporting me by [sponsoring the project](https://github.com/sponsors/nelsonlaidev).

## License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
Made with ❤️ in Hong Kong
</p>
