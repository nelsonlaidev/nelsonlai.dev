<div align="center">
  <a href="https://nelsonlai.dev">
    <img alt="Original nelsonlai.dev project artwork" src=".github/images/dark-header.png">
  </a>

  <h1 align="center">nelsonlai.dev</h1>

  <img src="https://img.shields.io/badge/TanStack%20Start-000000.svg?style=for-the-badge" alt="Framework: TanStack Start" />
  <img src="https://img.shields.io/github/languages/top/nelsonlaidev/nelsonlai.dev?style=for-the-badge&labelColor=000" alt="Language" />
  <img src="https://img.shields.io/github/license/nelsonlaidev/nelsonlai.dev?style=for-the-badge&labelColor=000" alt="License" />
</div>

My personal blog and portfolio website, migrated from Next.js to TanStack Start.
This pnpm workspace contains the web application and shared packages for its API,
authentication, database, email templates, caching, UI, and MDX processing.
The header artwork is preserved from the original project.

## Features

### Application and content

- TanStack Start and TanStack Router with React 19 and TypeScript.
- Vite and Nitro for development and production builds.
- Tailwind CSS v4, Base UI, Ark UI, Motion, and responsive layouts.
- MDX content through Content Collections, with Shiki syntax highlighting,
  image zoom, and article tables of contents.
- Paraglide translations for English, Traditional Chinese, Simplified Chinese,
  Japanese, Spanish, and Brazilian Portuguese, with remembered language preferences.
- A fixed Seafold color palette and a keyboard-driven command menu.
- Blog search, likes, view counts, comments, replies, and voting.
- Guestbook, account settings, active sessions, and an admin dashboard.
- Localized metadata, JSON-LD, RSS feeds, a sitemap, and dynamic WebP Open Graph
  images rendered with Takumi.

### Authentication and integrations

- Better Auth with Google and GitHub OAuth, backed by PostgreSQL and Drizzle ORM.
- oRPC for the type-safe API and TanStack Query for client data.
- Redis caching and rate limiting through the Upstash REST interface; local
  development uses Redis with UpREST.
- Cloudflare R2 for avatar storage, Resend for transactional emails, and Discord
  notifications.
- GitHub, YouTube, WakaTime, Spotify, and Umami integrations.
- Varlock schemas for environment validation and generated environment modules.
- Self-hosted interface fonts through Fontsource.

### Development tools

- Vitest unit tests and Playwright E2E tests with isolated Docker services.
- Oxlint, including Playwright and Vitest rules; Oxfmt; CSpell; Knip; and Inlang
  translation checks.
- Lefthook pre-commit checks and Conventional Commits.
- GitHub Actions CI, Dependabot, code ownership, and GitHub Sponsors metadata.

## Getting started

### Prerequisites

- Node.js 24 or newer.
- The pnpm version declared in [package.json](package.json).
- Docker with Docker Compose for local PostgreSQL, Redis, and UpREST services.
- Optionally, Visual Studio Code with the [recommended extensions](.vscode/extensions.json).

Run the following commands from the root of this checkout.

### Install dependencies

```sh
pnpm install --frozen-lockfile
```

### Configure the environment

Create `apps/web/.env.local` using [apps/web/.env.schema](apps/web/.env.schema)
as the reference. The required local configuration is:

```dotenv
SITE_URL=http://localhost:3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/nelsonlaidev
UPSTASH_REDIS_REST_URL=http://localhost:8079
UPSTASH_REDIS_REST_TOKEN=local-uprest-token-7f3c9a2e6b1d4f80
IP_ADDRESS_SALT=replace-with-your-own-random-secret-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace-with-another-random-secret-at-least-32-characters
RESEND_FROM_EMAIL="Nelson Lai <noreply@example.invalid>"
```

Replace each secret placeholder with a different random value. For example, run
`openssl rand -hex 32` separately for each secret. Keep `IP_ADDRESS_SALT` stable
to preserve anonymous identifiers. `BETTER_AUTH_URL` defaults to `SITE_URL` when
it is not explicitly set.

Varlock loads this environment through the web schema and the shared packages'
schema imports. The root [.env.schema](.env.schema) exposes the same configuration
to workspace tooling. Generate environment modules before building or running
package commands on a fresh checkout:

```sh
pnpm env:check
pnpm env:generate
```

The generated `src/env.ts` files are ignored by Git. Do not edit them directly.

Optional integration variables are documented in the web schema:

| Integration                              | Variables                                                                                                                                           |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google sign-in                           | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`                                                                                                          |
| GitHub sign-in                           | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`                                                                                                          |
| Comment notifications                    | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `AUTHOR_EMAIL`                                                                                               |
| Reply unsubscribe tokens                 | `JWT_SECRET` (falls back to `BETTER_AUTH_SECRET`)                                                                                                   |
| Discord notifications                    | `DISCORD_WEBHOOK_URL`                                                                                                                               |
| Avatar storage                           | `CLOUDFLARE_R2_ENDPOINT`, `CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_R2_BUCKET_NAME`, `CLOUDFLARE_R2_PUBLIC_URL` |
| GitHub, YouTube, and WakaTime statistics | `GITHUB_TOKEN`, `GOOGLE_API_KEY`, `WAKATIME_API_KEY`                                                                                                |
| Spotify playback                         | `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`                                                                               |
| Location lookup                          | `NELSONLAI_API_KEY`                                                                                                                                 |
| Umami analytics                          | `UMAMI_URL`, `UMAMI_WEBSITE_ID`                                                                                                                     |

OAuth providers are enabled when both their client ID and secret are configured.
Blog comment email notifications are sent only in production. Local development
does not require credentials for these optional services, but
`RESEND_FROM_EMAIL` is still required by environment validation.

### Start local services and initialize the database

Use a database dedicated to this application. The example above matches the
development database created by this checkout's Compose stack. Do not point
initialization commands at the legacy application's database.

```sh
docker compose up -d --wait
pnpm db:push
pnpm db:seed
```

`db:push` initializes an empty development database from the current schema.
The checkout does not currently contain generated SQL migrations. When managing
schema changes through migration files, use `pnpm db:generate` and
`pnpm db:migrate`. Schema changes are separate from manually transferring legacy
records. The seed command inserts missing blog post slugs; it does not transfer
legacy users, comments, likes, or other records.

Run `pnpm db:reset` in an interactive terminal to delete all data and rebuild the
database. The command asks for confirmation and asks again for non-local hosts.
It drops the `public` and `drizzle` schemas, recreates `public`, applies SQL
migrations when present (otherwise runs `db:push`), and runs `db:seed`.

### Start the application

```sh
pnpm dev
```

Turborepo builds the shared MDX compiler before starting the web application. Vite
generates content collections, translated messages, and route files.

| Service         | Address                 |
| --------------- | ----------------------- |
| Web application | `http://localhost:3000` |
| PostgreSQL      | `localhost:5432`        |
| Redis           | `localhost:6379`        |
| UpREST          | `http://localhost:8079` |

## Workspace structure

```text
.
├── .github/                 # CI, Dependabot, metadata, and README images
├── .vscode/                 # Editor settings and recommended extensions
├── apps/web/
│   ├── content/             # Localized MDX posts, pages, and projects
│   ├── messages/            # Translation catalogs
│   ├── project.inlang/      # Paraglide configuration
│   ├── public/              # Site images, icons, and videos
│   └── src/
│       ├── components/      # Shared web components and MDX rendering
│       ├── features/        # Account, admin, comments, guestbook, and posts
│       ├── hooks/           # Web application hooks
│       ├── lib/             # Application integrations and metadata
│       ├── routes/          # TanStack pages and HTTP handlers
│       ├── styles/          # Application styles
│       └── tests/           # Unit tests, E2E tests, and fixtures
├── packages/
│   ├── api/                 # oRPC routers, validation, and integrations
│   ├── auth/                # Better Auth configuration
│   ├── db/                  # Drizzle schema, relations, and seed script
│   ├── email/               # React Email templates and delivery
│   ├── kv/                  # Redis cache and rate limiting
│   ├── mdx/                 # MDX compilation, metadata, and syntax highlighting
│   ├── ui/                  # UI components and shared theme styles
│   └── utils/               # Shared utilities
├── docker-compose.yaml      # Development services
├── docker-compose.test.yaml # Isolated test services
├── pnpm-workspace.yaml      # Workspace packages and dependency catalog
└── turbo.json               # Workspace task configuration
```

## Build and deployment

Build the workspace and preview the production build locally:

```sh
pnpm env:generate
pnpm build
pnpm --filter @repo/web preview --host localhost --port 3000
```

Production builds use Nitro's Node.js server output at `apps/web/.output`.
With the deployment environment configured, the server entry point is:

```sh
node apps/web/.output/server/index.mjs
```

See [Nitro's Node.js deployment documentation](https://nitro.build/deploy/runtimes/node)
for the output layout and host/port settings. Set the public site and auth URLs
for the deployment before building.

The deployment target is Docker containers on the owner's VPS through Dokploy,
behind Cloudflare. The current `docker-compose.yaml` defines supporting services
only; an application Dockerfile and Dokploy deployment configuration are not
included in this checkout.

## Quality checks and tests

Build once before running all checks on a fresh checkout so generated content,
translations, and route files are available:

```sh
pnpm build
pnpm format:check
pnpm lint
pnpm spellcheck
pnpm typecheck
pnpm knip
pnpm --filter @repo/web i18n:check
pnpm test:unit
```

For E2E tests:

```sh
pnpm test:e2e:install
pnpm test:e2e
```

E2E tests use dedicated services and a preview server on port 3100. They do not
use the development database. See [the web test and CI documentation](apps/web/README.md)
for test isolation, cleanup, coverage, report locations, and integration limits.

The [CI workflow](.github/workflows/ci.yml) runs checks and E2E tests on pull
requests and pushes to `main`.

## Useful commands

| Command                                        | Purpose                                               |
| ---------------------------------------------- | ----------------------------------------------------- |
| `pnpm env:check` / `pnpm env:generate`         | Validate configuration / generate environment modules |
| `pnpm dev` / `pnpm build`                      | Start development / build the workspace               |
| `pnpm format` / `pnpm lint:fix`                | Format files / apply lint fixes                       |
| `pnpm db:generate` / `pnpm db:migrate`         | Generate / apply SQL migrations                       |
| `pnpm db:push` / `pnpm db:seed`                | Apply the schema directly / seed missing post slugs   |
| `pnpm db:studio`                               | Open Drizzle Studio                                   |
| `pnpm db:reset`                                | Confirm, rebuild the database, and seed post slugs    |
| `pnpm test:unit:watch` / `pnpm test:unit:ui`   | Run unit tests interactively                          |
| `pnpm test:unit:coverage`                      | Generate unit test coverage                           |
| `pnpm test:e2e:ui` / `pnpm test:e2e:inspector` | Run Playwright interactively                          |
| `pnpm --filter @repo/web generate-routes`      | Generate TanStack route files                         |
| `pnpm email:dev` / `pnpm email:export`         | Preview email templates / export their HTML           |

## Email templates

Templates and delivery code live in [packages/email](packages/email).
Run these commands from the repository root:

```sh
pnpm email:dev
pnpm email:export
```

`email:dev` starts the React Email preview at `http://localhost:3001`, using the
templates' `PreviewProps`. `email:export` renders both templates as HTML in
`packages/email/out`, using the same sample data when no props are provided.
Both commands load configuration through Varlock and the
existing web environment schema. These commands preview or export templates;
they do not send email. Generated output is ignored by Git.

The original template previews are preserved below.

### Comment notification

![Comment notification template](.github/images/comment-notification-email.png)

### Reply notification

![Reply notification template](.github/images/reply-notification-email.png)

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
