# Risedle's Snapshot Services

This is monorepo of Risedle's Snapshot services.

## Snapshot Services

- [PostgreSQL](./postgresql): Database that store all snapshot data.
- [Vault Snapshot Worker](./vault-snapshot-worker): Service that collect data from Vault contract
- [Leveraged Token Snapshot Worker](./lt-snapshot-worker): Service that collect data from Leveraged Tokens contract
- [Snapshot API](./snapshot-api): REST API service that serve data collected by the workers.
