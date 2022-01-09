import {MigrationInterface, QueryRunner} from "typeorm";

export class VaultSnapshotCrate1641740182440 implements MigrationInterface {
    name = 'VaultSnapshotCrate1641740182440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vault_snapshot" ("id" SERIAL NOT NULL, "contractAddress" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "borrowAPY" double precision NOT NULL, "supplyAPY" double precision NOT NULL, "totalAvailableCash" integer NOT NULL, "utilizationRate" double precision NOT NULL, "totalOutstandingDebt" integer NOT NULL, CONSTRAINT "PK_06881703ade8a5162b01a8c2ec7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "vault_snapshot"`);
    }

}
