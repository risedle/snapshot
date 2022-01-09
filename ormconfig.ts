export default {
    type: "postgres",
    url: process.env.POSTGRES_URL,
    entities: ["entities/*.ts"],
    migrations: ["migrations/*.ts"],
    cli: {
        migrationsDir: "migrations",
        entitiesDir: "entities",
    },
};
