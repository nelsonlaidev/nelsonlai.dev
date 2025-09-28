#!/usr/bin/env bash
set -euo pipefail

# Ensure required environment variables are set
VARS=(
	"NEXT_PUBLIC_SITE_URL"
	"DATABASE_URL"
	"UPSTASH_REDIS_REST_URL"
	"UPSTASH_REDIS_REST_TOKEN"
	"IP_ADDRESS_SALT"
	"BETTER_AUTH_SECRET"
	"GITHUB_CLIENT_ID"
	"GITHUB_CLIENT_SECRET"
	"POSTGRES_USER"
	"POSTGRES_PASSWORD"
	"POSTGRES_DB"
)

for VAR in "${VARS[@]}"; do
	if [ -z "${!VAR}" ]; then
		echo "Error: Environment variable $VAR is not set."
		exit 1
	fi
done

# Write variables to .env.local
ENV_FILE=".env.local"
: > "$ENV_FILE"

for VAR in "${VARS[@]}"; do
	echo "$VAR=${!VAR}" >> "$ENV_FILE"
done

echo ".env.local generated successfully."

# Install packages
apt-get update -qq
apt-get install -yqq --no-install-recommends \
	postgresql-16 redis-server curl ca-certificates gnupg \
	> /dev/null

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
export SRH_MODE="env"
export SRH_MAX_CONNECTIONS="10"
export SRH_PORT="8079"
export SRH_TOKEN="${UPSTASH_REDIS_REST_TOKEN}"
export SRH_CONNECTION_STRING="redis://127.0.0.1:6379"

SRH_VERSION="0.0.10"
SRH_TARBALL="serverless-redis-http-${SRH_VERSION}.tar.gz"
SRH_URL="https://github.com/nelsonlaidev/srh-build/releases/download/${SRH_VERSION}/${SRH_TARBALL}"
SRH_TMP_DIR="$(mktemp -d)"

(
	set -euo pipefail
	echo "Downloading SRH build version ${SRH_VERSION}..."
	curl -fsSL -o "${SRH_TMP_DIR}/${SRH_TARBALL}" "${SRH_URL}"

	tar -xzf "${SRH_TMP_DIR}/${SRH_TARBALL}" -C "${SRH_TMP_DIR}"

	cd "${SRH_TMP_DIR}/prod" || {
		echo "Error: release directory 'prod' not found"
		exit 1
	}

	# Start SRH
	./bin/prod start &
)

sleep 3

if curl -s http://localhost:${SRH_PORT}/ | grep -q "Welcome to Serverless Redis HTTP!"; then
	echo "Serverless Redis HTTP is running successfully on port ${SRH_PORT}"
else
	echo "Health check failed: did not receive expected response."
	exit 1
fi

# Set up project
pnpm install
pnpm db:migrate
pnpm db:seed
