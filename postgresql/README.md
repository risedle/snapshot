# PostgreSQL

PostgreSQL service stores all snapshot data collected by the snapshot workers.

This service is deployed using
[Fly.io PostgreSQL App](https://fly.io/docs/reference/postgres/).

## Deployment

Create new postgresql app on fly.io:

    flyctl postgres create

You need to connect to fly.io postgress locally, please read the following
[documentation](https://fly.io/docs/reference/private-networking/#private-network-vpn).

Connect to the postgresql using any PostgreSQL client, for example you may use
[PGAdmin](https://www.pgadmin.org/).

Then create new database for each network, for example `snapshot_kovan`.

Then you will have the following connection url:

    postgres://postgres:SECRET@snapshot-postgresql.internal:5432/DATABASE

Use this connection url for the app.
