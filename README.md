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
