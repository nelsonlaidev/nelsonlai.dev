# [Seafold](https://nelsonlai.dev)

My personal blog and portfolio, built with TanStack Start and TypeScript.

[![Seafold homepage](.github/images/header.png)](https://nelsonlai.dev)

## Local development

You’ll need Node.js 24+, the pnpm version pinned in [`package.json`](package.json), and Docker Compose. Run the commands below from the repository root.

Create `apps/web/.env.local` with these settings. Generate a different value for each blank secret with `openssl rand -hex 32`, and keep `IP_ADDRESS_SALT` stable. See the [environment schema](apps/web/.env.schema) for optional integrations.

```dotenv
DATABASE_URL="postgres://postgres:postgres@localhost:5432/nelsonlaidev"
UPSTASH_REDIS_REST_URL="http://localhost:8079"
UPSTASH_REDIS_REST_TOKEN="local-uprest-token-7f3c9a2e6b1d4f80"
IP_ADDRESS_SALT=""
BETTER_AUTH_SECRET=""
JWT_SECRET=""
RESEND_FROM_EMAIL="Local Development <noreply@example.com>"
```

```bash
pnpm install
pnpm env:check
pnpm env:generate
docker compose up -d --wait
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open [localhost:3000](http://localhost:3000). For other commands, see [`package.json`](package.json).

## Author

[@nelsonlaidev](https://github.com/nelsonlaidev)

## Sponsorship

If you find this project helpful, consider [sponsoring me on GitHub](https://github.com/sponsors/nelsonlaidev).

## License

This project is licensed under the [MIT License](LICENSE).
