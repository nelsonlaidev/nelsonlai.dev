FROM node:24-bookworm-slim AS base
WORKDIR /app

FROM base AS tools
COPY package.json ./
RUN npm install --global "$(node -p 'require("./package.json").packageManager')" \
    "turbo@$(node -p 'require("./package.json").devDependencies.turbo')"

FROM tools AS prune
COPY .gitignore pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/ ./apps/
COPY packages/ ./packages/
RUN turbo prune @repo/web --docker

FROM tools AS build
COPY --from=prune /app/out/json/ ./
RUN --mount=type=cache,id=nelsonlaidev-pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir=/pnpm/store
COPY --from=prune /app/out/full/ ./

ARG TARGETARCH
RUN --mount=type=bind,source=.env,target=/app/apps/web/.env \
    --mount=type=cache,id=nelsonlaidev-turbo-${TARGETARCH},target=/app/.turbo/cache \
    NODE_ENV=production pnpm exec turbo run build --filter=@repo/web

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /app/apps/web/.output/ ./.output/
COPY .env.schema ./
COPY --from=build /app/apps/web/.env.schema ./apps/web/.env.schema
COPY --from=build /app/apps/web/node_modules/varlock/ ./node_modules/varlock/
RUN ln -s /app/node_modules/varlock/bin/cli.js /usr/local/bin/varlock
USER node
EXPOSE 3000
CMD ["node", "--import", "varlock/auto-load", ".output/server/index.mjs"]
