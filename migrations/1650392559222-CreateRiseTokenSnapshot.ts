import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateRiseTokenSnapshot1650392559222 implements MigrationInterface {
    name = 'CreateRiseTokenSnapshot1650392559222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rise_token_snapshot" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "address" character varying NOT NULL, "cps" double precision NOT NULL, "dps" double precision NOT NULL, "lr" double precision NOT NULL, "nav" double precision NOT NULL, "totalSupply" double precision NOT NULL, "totalCollateral" double precision NOT NULL, "totalDebt" double precision NOT NULL, "blockNumber" integer, CONSTRAINT "PK_06258a2f2eff6fa2537ce717c27" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "rise_token_snapshot"`);
    }

}
