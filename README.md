# Risedle's Snapshot Services

This is monorepo of Risedle's Snapshot services.

## Snapshot Services

-   [PostgreSQL](./postgresql): Database that store all snapshot data.
-   [Vault Snapshot Worker](./vault-snapshot-worker): Service that collect data
    from Vault contract
-   [Leveraged Token Snapshot Worker](./lt-snapshot-worker): Service that
    collect data from Leveraged Tokens contract
-   [Snapshot API](./snapshot-api): REST API service that serve data collected
    by the workers.

## Database

We use [TypeORM](https://typeorm.io/) to manage the database.

Please read [PostgreSQL](./postgresql/README.md) for more details on how to
connect the database to your local machine.

### Updating Schema

Copy `.env.example` to `.env` and edit the content.

Then follow step by step below:

1. Update entity in `./entities`.
2. Generate the migration file:
   `npm run typeorm migration:generate -- -n MIGRATIONNAME`
3. Run the migrations: `npm run typeorm migration:run`

## Deployment

This bot is deployed to [fly.io](https://fly.io/docs/introduction/).

Create new app:

    flyctl launch

Set the secrets:

    flyctl secrets --app snapshot-kovan-workers set RPC_URL="here" SENTRY_DSN="here" POSTGRES_URL="here"

    flyctl secrets --app snapshot-kovan-api set RPC_URL="here" SENTRY_DSN="here" POSTGRES_URL="here"

Run the following command to deploy:

    flyctl deploy --app snapshot-kovan-workers --config snapshot-kovan-workers.toml .

    flyctl deploy --app snapshot-kovan-api --config snapshot-kovan-api.toml .
