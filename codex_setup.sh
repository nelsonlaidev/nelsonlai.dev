#!/usr/bin/env bash
set -euo pipefail

# Ensure required environment variables are set
VARS=(
  "POSTGRES_USER"
  "POSTGRES_PASSWORD"
  "POSTGRES_DB"
  "DATABASE_URL"
  "GITHUB_CLIENT_ID"
  "GITHUB_CLIENT_SECRET"
  "UPSTASH_REDIS_REST_URL"
  "UPSTASH_REDIS_REST_TOKEN"
  "BETTER_AUTH_SECRET"
  "IP_ADDRESS_SALT"
  "NEXT_PUBLIC_SITE_URL"
)

for VAR in "${VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    echo "Error: Environment variable $VAR is not set."
    exit 1
  fi
done

# Install packages
apt-get update -qq
apt-get install -yqq --no-install-recommends \
  postgresql-16 redis-server curl ca-certificates gnupg \
  >/dev/null

# Delete old cluster and create a new one owned by the specified user
pg_dropcluster --stop 16 main || true
pg_createcluster --start -u postgres 16 main

# Check if Postgres user is "postgres"
if [ "$POSTGRES_USER" = "postgres" ]; then
  echo "Error: POSTGRES_USER cannot be 'postgres'. Please choose a different username."
  exit 1
fi

# Set up PostgreSQL user and database
sudo -u postgres createuser -s "${POSTGRES_USER}" || true
sudo -u postgres psql -v ON_ERROR_STOP=1 -c "ALTER USER \"${POSTGRES_USER}\" WITH PASSWORD '${POSTGRES_PASSWORD}';"
sudo -u postgres createdb -O "${POSTGRES_USER}" "${POSTGRES_DB}" || true

# Start Redis server
redis-server --daemonize yes

if ! redis-cli ping | grep -q "PONG"; then
  echo "Error: Redis server is not running."
  exit 1
fi

# Set up environment variables for serverless-redis-http
# export SRH_MODE="env"
# export SRH_MAX_CONNECTIONS="10"
# export SRH_PORT="8079"
# export SRH_TOKEN="${UPSTASH_REDIS_REST_TOKEN}"
# export SRH_CONNECTION_STRING="redis://127.0.0.1:6379"

# Set up project
pnpm install
pnpm db:migrate
pnpm db:seed
