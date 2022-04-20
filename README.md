# Risedle's Snapshot Services

This is monorepo of Risedle's Snapshot services.

## Snapshot Services

-   [PostgreSQL](./postgresql): Database that store all snapshot data.
-   [Snapshot Workers](./workers): Service that collect data from Vault contract
-   [Snapshot API](./api): REST API service that serve data collected by the
    workers.

## Database

We use [TypeORM](https://typeorm.io/) to manage the database.

Please read [PostgreSQL](./postgresql/README.md) for more details on how to
connect the database to your local machine.

### Setting up new chain

1. Create new database (e.g `snapshot_arbitrum`)
2. Create new `.env` based on `.env.example`
3. Run database migration `npm run typeorm migration:run`
4. Edit the `worker/cron.ts` with your config, try run locally first.
5. Create new app `flyctl launch` with specified name (e.g.
   `snapshot-arbitrum-workers`)
6. Create the secret
   `flyctl secrets --app snapshot-arbitrum-workers set RPC_URL="here" SENTRY_DSN="here" POSTGRES_URL="here"`
7. Create new fly config (e.g. `snapshot-arbitrum-workers.toml`)
8. Deploy the app
   `flyctl deploy --app snapshot-arbitrum-workers --config snapshot-arbitrum-workers.toml`
9. Create new app for the snapshot-api `flyctl launch` with name
   `snapshot-arbitrum-api`
10. Create new secret
    `flyctl secrets --app snapshot-arbitrum-api set RPC_URL="here" SENTRY_DSN="here" POSTGRES_URL="here"`
11. Create new fly config (e.g `snapshot-arbitrum-api.toml`)
12. Deploy the app
    `flyctl deploy --app snapshot-arbitrum-api --config snapshot-arbitrum-api.toml`
13. Setup custom domain name for the API and done.

### Updating Schema

Copy `.env.example` to `.env` and edit the content.

Then follow step by step below:

1. Update entity in `./entities`. Mark column as nullable if you add existing
   column, don't ever delete the existing column.
2. Generate the migration file:
   `npm run typeorm migration:generate -- -n MIGRATIONNAME`
3. Run the migrations: `npm run typeorm migration:run`

## Running API locally

Copy `.env.example` to `.env` and edit the content.

Make sure you setup the
[Fly.io wireguard](https://fly.io/docs/reference/private-networking/#private-network-vpn).

Then run the following command:

    node -r ts-node/register api/server.ts

## Running Worker locally

Copy `.env.example` to `.env` and edit the content.

Make sure you setup the
[Fly.io wireguard](https://fly.io/docs/reference/private-networking/#private-network-vpn).

Then run the following command:

    node -r ts-node/register workers/cron.ts

## Deployment

This bot is deployed to [fly.io](https://fly.io/docs/introduction/).

Create new app:

    flyctl launch

Set the secrets:

    flyctl secrets --app snapshot-kovan-workers set RPC_URL="here" SENTRY_DSN="here" POSTGRES_URL="here"
    flyctl secrets --app snapshot-kovan-api set RPC_URL="here" SENTRY_DSN="here" POSTGRES_URL="here"

    flyctl secrets --app snapshot-arbitrum-workers set RPC_URL="here" SENTRY_DSN="here" POSTGRES_URL="here"
    flyctl secrets --app snapshot-arbitrum-api set RPC_URL="here" SENTRY_DSN="here" POSTGRES_URL="here"

Run the following command to deploy:

    flyctl deploy --app snapshot-kovan-workers --config snapshot-kovan-workers.toml .
    flyctl deploy --app snapshot-kovan-api --config snapshot-kovan-api.toml .

    flyctl deploy --app snapshot-arbitrum-workers --config snapshot-arbitrum-workers.toml .
    flyctl deploy --app snapshot-arbitrum-api --config snapshot-arbitrum-api.toml .

Don't forget to sync schema for the first deployment.
