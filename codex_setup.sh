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

# Update indexes
apt-get update -qq

# Install essential packages
apt-get install -yqq --no-install-recommends curl

# Install PostgreSQL 16
apt-get install -yqq --no-install-recommends postgresql-16

# Install Redis
apt-get install -yqq --no-install-recommends redis-server

# Delete old cluster and create a new one owned by the specified user
pg_dropcluster --stop 16 main || true
pg_createcluster --start -u postgres 16 main

# Check if Postgres user is "postgres"
if [ "$POSTGRES_USER" = "postgres" ]; then
  echo "Error: POSTGRES_USER cannot be 'postgres'. Please choose a different username."
  exit 1
fi

# Set up PostgreSQL user and database
su - postgres -c "createuser -s \"${POSTGRES_USER}\""
su - postgres -c "psql -c \"ALTER USER \\\"${POSTGRES_USER}\\\" WITH PASSWORD '${POSTGRES_PASSWORD}';\""
su - postgres -c "createdb -O \"${POSTGRES_USER}\" \"${POSTGRES_DB}\""

# Start Redis server
redis-server --daemonize yes

if ! redis-cli ping | grep -q "PONG"; then
  echo "Error: Redis server is not running."
  exit 1
fi

# Download and extract serverless-redis-http
SRH_VERSION="0.0.10"
curl -L -o srh-${SRH_VERSION}.tar.gz https://github.com/hiett/serverless-redis-http/archive/refs/tags/${SRH_VERSION}.tar.gz
tar -xzf srh-${SRH_VERSION}.tar.gz
rm -f srh-${SRH_VERSION}.tar.gz

# Set up environment variables for serverless-redis-http
export SRH_MODE="env"
export SRH_MAX_CONNECTIONS="10"
export SRH_PORT="8079"
export SRH_TOKEN="${UPSTASH_REDIS_REST_TOKEN}"
export SRH_CONNECTION_STRING="redis://127.0.0.1:6379"

# Install Elixir dependencies and start serverless-redis-http
(
  set -euo pipefail
  cd serverless-redis-http-${SRH_VERSION}
  mix local.hex --force
  mix local.rebar --force
  mix deps.get
  nohup mix phx.server >srh_dev.log 2>&1 &
)

# Set up project
pnpm install
pnpm db:migrate
pnpm db:seed
